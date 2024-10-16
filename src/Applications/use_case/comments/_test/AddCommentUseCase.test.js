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

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    /** creating use case instance */
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

    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      thread_id: useCasePayload.thread_id,
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
  });
});
