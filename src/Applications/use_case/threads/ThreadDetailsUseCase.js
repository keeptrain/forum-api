const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');
const ThreadDetails = require('../../../Domains/threads/entities/ThreadDetails');

class ThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseThread) {
    // Mengambil detail thread berdasarkan id
    const threadDetail = await this._threadRepository.getThreadById(useCaseThread);

    // Mengambil detail komentar berdasarkan id thread
    const comments = await this._commentRepository.getCommentsByThreadId(threadDetail.id);
    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
    }));
    // Menggabungkan threadDetail dengan commentDetail
    return {
      ...threadDetail,
      comments: formattedComments,
    };
  }
}

module.exports = ThreadDetailsUseCase;
