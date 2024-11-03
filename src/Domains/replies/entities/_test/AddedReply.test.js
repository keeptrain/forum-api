const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: '1',
      content: 'abc',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 1,
      content: 'abc',
      owner: 'user-001',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-01',
      content: 'abc',
      owner: 'user-01',
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
