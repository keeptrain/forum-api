const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadDetails = require('../../../Domains/threads/entities/ThreadDetails');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: 'threadpostgres-test' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist thread and return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'this is title',
        body: 'this is body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'this is title',
        body: 'this is body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const thread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(thread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'this is title',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-111'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return get thread by id correctly when thread exists', async () => {
      const mockDate = new Date();

      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-456',
        title: 'this is title get thread',
        body: 'this is body get thread',
        owner: 'user-123',
        date: mockDate.toISOString(),
      });

      const fakeIdGenerator = () => '456'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-456');

      // Assert
      expect(thread).toEqual(
        new ThreadDetails({
          id: 'thread-456',
          title: 'this is title get thread',
          body: 'this is body get thread',
          date: mockDate.toISOString(),
          username: 'threadpostgres-test',
        }),
      );
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread exists', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ title: 'verifythread-test' });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });
});
