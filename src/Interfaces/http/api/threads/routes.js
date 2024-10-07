const routes = (handler) => ([
    {
      method: 'POST',
      path: '/threads',
      handler: handler.postThreadHandler,
    },
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: handler.postThreadCommentsHandler,
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
    }
  ]);
  
  module.exports = routes;
  