const DeleteComment = require('../../../Domains/likeComments/entities/NewLikeComment');

class DeleteLikeCommentUseCase {
  constructor({ likeCommentRepository, commentRepository }) {
    this._likeCommentRepository = likeCommentRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { commentId, owner } = new DeleteComment(useCasePayload);
    await this._commentRepository.verifyCommentAvailability(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    await this._likeCommentRepository.deleteLikeComment(useCasePayload.id);
  }
}

module.exports = DeleteLikeCommentUseCase;
