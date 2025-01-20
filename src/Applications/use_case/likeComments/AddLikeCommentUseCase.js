const NewLikeComment = require('../../../Domains/likeComments/entities/NewLikeComment');

class AddLikeCommentUseCase {
  constructor({ likeCommentRepository, commentRepository }) {
    this._likeCommentRepository = likeCommentRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const newLikeComment = new NewLikeComment(useCasePayload);
    await this._commentRepository.verifyCommentAvailable(newLikeComment.comment_id);
    await this._likeCommentRepository.isLikeCommentExist(newLikeComment.comment_id);
    return this._likeCommentRepository.addLikeComment(newLikeComment);
  }
}

module.exports = AddLikeCommentUseCase;
