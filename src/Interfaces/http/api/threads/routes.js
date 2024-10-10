const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/threadId',
    handler: handler.getThreadDetailHandler,
  },
  /* {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postThreadCommentsHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/commentId',
    handler: handler.deleteThreadCommentsHandler,
  },
  {
    method: 'GET',
    path: '/threads/threadId',
    handler: handler.getThreadDetailHandler,
  }, */
]);

module.exports = routes;
