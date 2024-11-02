const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AuthenticationsTestHelper = require('../../../../tests/AuthenticationsTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
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
  });

  const threadPayload = {
    id: 'thread-001',
    title: 'This is a title',
    body: 'This is a body',
  };

  describe('when POST /comments', () => {
    it('should response 201 and persisted comment', async () => {
      const requestPayload = {
        content: 'This is a comment',
      };

      await UsersTableTestHelper.addUser({ id: 'user-001' });

      await ThreadsTableTestHelper.addThread({
        ...threadPayload,
        owner: 'user-001',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
    });

    it('should response 401 when when missing authentication', async () => {
      const requestPayload = {
        content: 'This is a comment',
      };

      await UsersTableTestHelper.addUser({ id: 'user-002' });

      await ThreadsTableTestHelper.addThread({
        ...threadPayload,
        owner: 'user-002',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments`,
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should be 404 ', async () => {
      const requestPayload = {
        content: 'This is a comment',
      };

      await UsersTableTestHelper.addUser({ id: 'user-002' });

      await ThreadsTableTestHelper.addThread({
        ...threadPayload,
        owner: 'user-002',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-002/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {};
      await UsersTableTestHelper.addUser({ id: 'user-002' });

      await ThreadsTableTestHelper.addThread({
        ...threadPayload,
        owner: 'user-002',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-002/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });
  });

  describe('when DELETE /comments', () => {
    it('should respond 200 when the comment is deleted', async () => {
      const newAccessToken = await AuthenticationsTestHelper.getAccessToken();

      const result = await UsersTableTestHelper.findUsername('user');
      const { id: owner } = result;

      await ThreadsTableTestHelper.addThread({ id: 'thread-201', owner });
      await CommentsTableTestHelper.addComment({
        id: 'comment-200',
        thread_id: 'thread-201',
        owner,
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-201/comments/comment-200',
        headers: {
          authorization: `Bearer ${newAccessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when when missing authentication', async () => {
      await UsersTableTestHelper.addUser({ username: 'Test 401' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-401' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-401',
        thread_id: 'thread-401',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-401/comments/comment-401',

      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 404 when comment not found', async () => {
      await UsersTableTestHelper.addUser({ username: 'Test 404' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-404' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-201',
        thread_id: 'thread-404',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-404/comments/comment-404',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 403 when delete comment wrong owner', async () => {
      await UsersTableTestHelper.addUser({ username: 'Test 403' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-403' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-201',
        thread_id: 'thread-403',
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-403/comments/comment-201',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
