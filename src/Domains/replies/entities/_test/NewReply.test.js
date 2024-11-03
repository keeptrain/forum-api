const NewReply = require('../NewReply');

describe('a NewReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      threadId: '1',
      commentId: '1',
      content: 'abc',
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 1,
      commentId: 1,
      content: 'abc',
      owner: 'user-01',
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-01',
      commentId: 'comment-01',
      content: 'abc',
      owner: 'user-01',
    };

    // Action
    const newReply = new NewReply(payload);

    // Assert
    expect(newReply.threadId).toEqual(payload.threadId);
    expect(newReply.commentId).toEqual(payload.commentId);
    expect(newReply.content).toEqual(payload.content);
    expect(newReply.owner).toEqual(payload.owner);
  });
});
