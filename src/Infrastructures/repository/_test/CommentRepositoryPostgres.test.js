const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: 'commentpostgres' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-testcomment' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        thread_id: 'thread-testcomment',
        content: 'this is content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        thread_id: 'thread-testcomment',
        content: 'this is content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '456';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const comment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(comment).toStrictEqual(new AddedComment({
        id: 'comment-456',
        content: 'this is content',
        owner: 'user-123',
      }));
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return get comment by thread id correctly when comment exists', async () => {
      const mockDate = new Date();

      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        thread_id: 'thread-testcomment',
        content: 'this is get comment content',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentsByThreadId('thread-testcomment');

      // Assert
      expect(comment).toHaveLength(1);
      expect(comment[0]).toEqual({
        id: 'comment-456',
        username: 'commentpostgres',
        date: mockDate.toISOString(),
        content: 'this is get comment content',
        is_delete: false,
      });
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-aiueo'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should perform a soft delete and update column is_delete to true', async () => {
      const mockDate = new Date();
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-789',
        thread_id: 'thread-testcomment',
        content: 'this is delete comment content',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-789');

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-789');
      expect(comment[0]).toEqual({
        id: 'comment-789',
        thread_id: 'thread-testcomment',
        owner: 'user-123',
        date: mockDate.toISOString(),
        content: 'this is delete comment content',
        is_delete: true,
      });
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-aiueo'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment exists', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: 'thread-testcomment',
        content: 'this is check availability comment content',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when comment is wrong owner', async () => {
      // Arrange
      const newComment = new NewComment({
        thread_id: 'thread-testcomment',
        content: 'this is content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await CommentsTableTestHelper.addComment({
        thread_id: newComment.thread_id,
        owner: newComment.owner,
      });

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment owner is valid', async () => {
      // Arrange
      const newComment = new NewComment({
        thread_id: 'thread-testcomment',
        content: 'this is content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '456'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-456', 'user-123'))
        .resolves
        .not
        .toThrowError(AuthorizationError);
    });
  });
});
