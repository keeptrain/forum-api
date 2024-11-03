const DeleteReply = require('../DeleteReply');

describe('a DeleteReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-01',
    };

    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 1,
      owner: 'user-01',
    };

    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-01',
      owner: 'user-01',
    };

    // Action
    const deleteReply = new DeleteReply(payload);

    // Assert
    expect(deleteReply.id).toEqual(payload.id);
    expect(deleteReply.owner).toEqual(payload.owner);
  });
});
