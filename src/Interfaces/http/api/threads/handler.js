const AddThreadUsecase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this._postThreadHandler = this.postThreadHandler(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.params;
    const addThreadUsecase = this._container.getInstance(AddThreadUsecase.name);
  }

  async postThreadCommentsHandler(request, h) {

  }

  async deleteThreadCommentsHandler(request, h) {

  }

  async getThreadDetailHandler(request, h) {

  }
}

module.exports = ThreadsHandler;
