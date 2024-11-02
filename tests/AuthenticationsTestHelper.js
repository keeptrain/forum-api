const container = require('../src/Infrastructures/container');
const createServer = require('../src/Infrastructures/http/createServer');

const AuthenticationsTestHelper = {
  async getAccessToken() {
    // Arrange
    const server = await createServer(container);
    const userPayload = {
      username: 'user',
      password: 'secret',
      fullname: 'Test user',
    };

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload,
    });

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: userPayload.username,
        password: userPayload.password,
      },
    });

    const responseJson = JSON.parse(response.payload);
    return responseJson.data.accessToken;
  },
};

module.exports = AuthenticationsTestHelper;
