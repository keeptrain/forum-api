const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/replies/DeleteReplyUseCase');

class RepliessHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { threadId } = request.params;
    const { commentId } = request.params;
    const { content } = request.payload;
    const { id: owner } = request.auth.credentials;
    const addedReply = await addReplyUseCase.execute({
      threadId, commentId, content, owner,
    });
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const { replyId: id } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute({ id, owner });
    return {
      status: 'success',
    };
  }
}

module.exports = RepliessHandler;
