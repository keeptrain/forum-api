const AddedReply = require('../../../../Domains/replies/entities/AddedReply');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const NewReply = require('../../../../Domains/replies/entities/NewReply');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-1',
      commentId: 'comment-1',
      content: 'this reply',
      owner: 'owner-1',
    };

    const mockReply = new AddedReply({
      id: 'reply-1',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReply));

    // Create the use case instace
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-1',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));

    expect(mockThreadRepository.verifyAvailableThread)
      .toHaveBeenCalledWith('thread-1');
    expect(mockCommentRepository.verifyCommentAvailability)
      .toHaveBeenCalledWith('comment-1');

    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      threadId: 'thread-1',
      commentId: 'comment-1',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
  });
});
