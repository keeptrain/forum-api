const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      id: 'comment-1',
      owner: 'owner-1',
    };

    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.checkCommentAvailability = jest.fn()
      .mockResolvedValue();
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockResolvedValue();
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockResolvedValue();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.checkCommentAvailability).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.id,
      useCasePayload.owner,
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      useCasePayload.id,
    );
  });
});
