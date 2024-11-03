const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: 'replypostgres' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-testreply' });
    await CommentsTableTestHelper.addComment({ id: 'comment-testreply', thread_id: 'thread-testreply' });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      const newReply = new NewReply({
        threadId: 'thread-testreply',
        commentId: 'comment-testreply',
        content: 'this is content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      const newReply = new NewReply({
        threadId: 'thread-testreply',
        commentId: 'comment-testreply',
        content: 'this is content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const reply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(reply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: newReply.content,
        owner: newReply.owner,
      }));
    });
  });

  describe('getRepliesOnCommentById function', () => {
    it('should return get replies by comment id correctly when reply exists', async () => {
      const mockDate = new Date();

      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        thread_id: 'thread-testreply',
        comment_id: 'comment-testreply',
        content: 'this is get reply content',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const reply = await replyRepositoryPostgres.getRepliesOnCommentById(['comment-testreply']);

      // Assert
      expect(reply).toHaveLength(1);
      expect(reply[0]).toEqual({
        id: 'reply-456',
        username: 'replypostgres',
        date: mockDate.toISOString(),
        content: 'this is get reply content',
        is_delete: false,
        comment_id: 'comment-testreply',
      });
    });
  });

  describe('deleteReplyById function', () => {
    it('should throw NotFoundError when reply is not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-aiueo'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should perform a soft delete and update column is_delete to true', async () => {
      const mockDate = new Date();
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-789',
        thread_id: 'thread-testreply',
        comment_id: 'comment-testreply',
        content: 'this is delete reply content',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyById('reply-789');

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-789');
      expect(reply[0]).toEqual({
        id: 'reply-789',
        thread_id: 'thread-testreply',
        comment_id: 'comment-testreply',
        owner: 'user-123',
        date: mockDate.toISOString(),
        content: 'this is delete reply content',
        is_delete: true,
      });
    });
  });

  describe('checkReplyAvailability function', () => {
    it('should throw NotFoundError when reply is not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('comment-aiueo'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply exists', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        thread_id: 'thread-testreply',
        comment_id: 'comment-testreply',
        content: 'this is delete reply content',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when reply is wrong owner', async () => {
      // Arrange
      const newReply = new NewReply({
        threadId: 'thread-testreply',
        commentId: 'comment-testreply',
        content: 'this is content to verify owner',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      // await replyRepositoryPostgres.addReply(newReply);
      await RepliesTableTestHelper.addReply({
        thread_id: newReply.threadId,
        comment_id: newReply.commentId,
        owner: newReply.owner,
      });

      // Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-456'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when reply owner is valid', async () => {
      // Arrange
      const newReply = new NewReply({
        threadId: 'thread-testreply',
        commentId: 'comment-testreply',
        content: 'this is content to verify owner',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await RepliesTableTestHelper.addReply({
        thread_id: newReply.threadId,
        comment_id: newReply.commentId,
        owner: newReply.owner,
      });

      // Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });
});
