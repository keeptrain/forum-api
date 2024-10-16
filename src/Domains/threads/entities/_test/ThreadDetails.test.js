const ThreadDetails = require('../ThreadDetails');

describe('a ThreadDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'test title',
      body: 'test body',
      date: 'test date',
      username: 'usertest',
    };

    expect(() => new ThreadDetails(payload)).toThrowError('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 1,
      title: 'test title',
      body: 'test body',
      date: 'test date',
      username: 'usertest',
    };

    expect(() => new ThreadDetails(payload)).toThrowError('THREAD_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE');
  });

  it('should create ThreadDetails object correctly', () => {
    const payload = {
      id: 'thread-test',
      title: 'test title',
      body: 'test body',
      date: 'test date',
      username: 'usertest',
    };

    const threadDetails = new ThreadDetails(payload);

    expect((threadDetails.id)).toEqual(payload.id);
    expect((threadDetails.title)).toEqual(payload.title);
    expect((threadDetails.body)).toEqual(payload.body);
    expect((threadDetails.date)).toEqual(payload.date);
    expect((threadDetails.username)).toEqual(payload.username);
  });
});
