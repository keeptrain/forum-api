const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-1',
      owner: 'owner-1',
    };

    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockCommentRepository.checkCommentAvailability = jest.fn()
      .mockResolvedValue();
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockResolvedValue();
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockResolvedValue();

    // Create the use case instace
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
