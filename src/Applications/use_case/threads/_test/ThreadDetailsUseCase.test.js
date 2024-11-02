const ThreadDetailsUseCase = require('../ThreadDetailsUseCase');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
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
    const expectedReplies = [
      {
        id: 'reply-1',
        comment_id: 'comment-1',
        username: 'user-004',
        date: '2024-10-10T10:30:00.000Z',
        content: 'This is a reply',
        is_delete: false,
      },
      {
        id: 'reply-2',
        comment_id: 'comment-1',
        username: 'user-003',
        date: '2024-10-10T11:00:00.000Z',
        content: 'This reply was deleted',
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mock implementation
    mockThreadRepository.getThreadById = jest.fn()
      .mockResolvedValue(expectedThreadDetail);
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockResolvedValue(expectedComments);
    mockReplyRepository.getRepliesOnCommentById = jest.fn()
      .mockResolvedValue(expectedReplies);

    const threadDetailsUseCase = new ThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
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
          replies: [
            {
              id: 'reply-1',
              username: 'user-004',
              date: '2024-10-10T10:30:00.000Z',
              content: 'This is a reply',
            },
            {
              id: 'reply-2',
              username: 'user-003',
              date: '2024-10-10T11:00:00.000Z',
              content: '**balasan telah dihapus**',
            },
          ],
        },
        {
          id: 'comment-2',
          username: 'user-003',
          date: '2024-10-09T11:00:00.000Z',
          content: '**komentar telah dihapus**',
          replies: [],
        },
      ],
    });
  });
});
