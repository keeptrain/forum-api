const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      thread_id: '1',
      content: 'abc',
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      thread_id: 1,
      content: 'abc',
      owner: 'user-01',
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    // Arrange
    const payload = {
      thread_id: 'thread-01',
      content: 'abc',
      owner: 'user-01',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.thread_id).toEqual(payload.thread_id);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
