const ThreadDetailsUseCase = require('../ThreadDetailsUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
// const ThreadDetails = require('../../../../Domains/threads/entities/ThreadDetails');

describe('ThreadDetailsUseCase', () => {
  it('should orchestrate the thread details retrieval action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123';
    const expectedThreadDetail = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2024-10-09T10:00:00.000Z',
      username: 'user-001',
    };
    const expectedComments = [
      {
        id: 'comment-1',
        username: 'user-002',
        date: '2024-10-09T10:30:00.000Z',
        content: 'This is a comment',
        is_delete: false,
      },
      {
        id: 'comment-2',
        username: 'user-003',
        date: '2024-10-09T11:00:00.000Z',
        content: 'This comment was deleted',
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mock implementation
    mockThreadRepository.getThreadById = jest.fn()
      .mockResolvedValue(expectedThreadDetail);
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockResolvedValue(expectedComments);

    const threadDetailsUseCase = new ThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await threadDetailsUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-123');
    expect(result).toEqual({
      ...expectedThreadDetail,
      comments: [
        {
          id: 'comment-1',
          username: 'user-002',
          date: '2024-10-09T10:30:00.000Z',
          content: 'This is a comment',
        },
        {
          id: 'comment-2',
          username: 'user-003',
          date: '2024-10-09T11:00:00.000Z',
          content: '**komentar telah dihapus**',
        },
      ],
    });
  });
});
