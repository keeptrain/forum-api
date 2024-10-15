class ThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseThread) {
    const threadDetail = await this._threadRepository.getThreadById(useCaseThread);
    const comments = await this._commentRepository.getCommentsByThreadId(threadDetail.id);
    const listComments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
    }));

    return {
      ...threadDetail,
      comments: listComments,
    };
  }
}

module.exports = ThreadDetailsUseCase;
