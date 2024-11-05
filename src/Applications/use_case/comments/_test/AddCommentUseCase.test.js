const NewComment = require('../../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread_id: 'thread-1',
      content: 'this comment',
      owner: 'owner-1',
    };

    const mockComment = new AddedComment({
      id: 'comment-1',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    // Create the use case instace
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-1',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));

    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith('thread-1');

    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      thread_id: 'thread-1',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
  });
});
