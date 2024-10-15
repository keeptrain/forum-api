const ThreadDetailsUseCase = require('../ThreadDetailsUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadDetails = require('../../../../Domains/threads/entities/ThreadDetails');

describe('ThreadDetailsUseCase', () => {
  it('should orchestrating the details thread action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-1';

    const mockThread = {
      id: useCasePayload,
      title: 'this thread title',
      body: 'this thread body',
      date: '2024-10-15T10:55:55.672Z',
      username: 'user-1',
    };

    const mockComments = [
      {
        id: 'comment-1',
        username: 'user-1',
        date: '2024-10-15T11:55:55.672Z',
        content: 'this comment',
        is_deleted: false,
      },
      {
        id: 'comment-2',
        username: 'user-2',
        date: '2024-10-15T12:55:55.672Z',
        content: '**komentar telah dihapus**',
        is_deleted: true,
      },
    ];

    const expectedThreadWithComments = {
      id: useCasePayload,
      title: 'this thread title',
      body: 'this thread body',
      date: '2024-10-15T10:55:55.672Z',
      username: 'user-1',
      comments: [
        {
          id: 'comment-1',
          username: 'user-1',
          date: '2024-10-15T11:55:55.672Z',
          content: 'this comment',
          is_deleted: false,
        },
        {
          id: 'comment-2',
          username: 'user-2',
          date: '2024-10-15T12:55:55.672Z',
          content: '**komentar telah dihapus**',
          is_deleted: true,
        },
      ],
    };

    // Mocking the dependencies using proper domain repository classes
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking methods from the repositories
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(mockThread);
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(mockComments);

    // Creating an instance of GetThreadUseCase
    const getThreadUseCase = new ThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act (run the use case)
    const result = getThreadUseCase.execute(useCasePayload);

    // Assert (ensure the function works as expected)
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(useCasePayload.id);
    expect(result).toEqual(expectedThreadWithComments);
  });
});
