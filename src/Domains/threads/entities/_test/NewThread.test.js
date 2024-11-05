const NewThread = require('../NewThread');

describe('a NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'abc',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 'abc',
      body: 123,
      owner: 'user-blalbla',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.PROPERTY_HAVE_WRONG_DATA_TYPE');
  });

  it('should create NewThread object correctly', () => {
    const payload = {
      title: 'abc',
      body: 'abc',
      owner: 'user-blabla',
    };

    const newThread = new NewThread(payload);

    expect((newThread.title)).toEqual(payload.title);
    expect((newThread.body)).toEqual(payload.body);
    expect((newThread.owner)).toEqual(payload.owner);
  });
});
