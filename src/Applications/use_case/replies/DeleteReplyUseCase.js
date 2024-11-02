class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { id, owner } = useCasePayload;
    await this._replyRepository.verifyReplyAvailability(id);
    await this._replyRepository.verifyReplyOwner(id, owner);
    await this._replyRepository.deleteReplyById(useCasePayload.id);
  }
}

module.exports = DeleteReplyUseCase;
