const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AuthenticationsTestHelper = require('../../../../tests/AuthenticationsTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/replies endpoint', () => {
  let accessToken;

  beforeAll(async () => {
    accessToken = await AuthenticationsTestHelper.getAccessToken();
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  const commentPayload = {
    id: 'comment-001',
    thread_id: 'thread-001',
    title: 'This is a title',
    body: 'This is a body',
  };

  describe('when POST /replies', () => {
    it('should response 201 and persisted reply', async () => {
      const requestPayload = {
        content: 'This is a reply',
      };

      await UsersTableTestHelper.addUser({ id: 'user-001' });

      await ThreadsTableTestHelper.addThread({ id: 'thread-001', owner: 'user-001' });

      await CommentsTableTestHelper.addComment({ id: commentPayload.id, thread_id: commentPayload.thread_id, owner: 'user-001' });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-001/comments/${commentPayload.id}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual(requestPayload.content);
    });
  });

  describe('when DELETE /replies', () => {
    it('should respond 200 when the reply is deleted', async () => {
      const newAccessToken = await AuthenticationsTestHelper.getAccessToken();

      const result = await UsersTableTestHelper.findUsername('user');
      const { id: owner } = result;

      await ThreadsTableTestHelper.addThread({ id: 'thread-200', owner });
      await CommentsTableTestHelper.addComment({ id: 'comment-200', thread_id: 'thread-200', owner });
      await RepliesTableTestHelper.addReply({
        id: 'reply-200',
        thread_id: 'thread-200',
        comment_id: 'comment-200',
        owner,
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-200/comments/comment-200/replies/reply-200',
        headers: {
          authorization: `Bearer ${newAccessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
