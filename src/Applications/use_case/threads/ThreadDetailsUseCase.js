const ThreadDetails = require('../../../Domains/threads/entities/ThreadDetails');

class ThreadDetailsUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCaseThread) {
    const threadDetail = await this._threadRepository.getThreadById(useCaseThread);
    // const thread = new ThreadDetails(useCaseThread);

      // get
    return {
      ...threadDetail,
    };
  }
}

module.exports = ThreadDetailsUseCase;
