class LoginController {
  async handle(httpRequest) {
    if (!httpRequest) {
      return {
        statusCode: 500,
      };
    }
    const { email, password } = httpRequest.body;
    if (!email || !password) {
      return {
        statusCode: 400,
      };
    }
  }
}

describe('LoginController', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });

  test('Should return 400 if no password is provided', async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });

  test('Should return 500 if no HttpRequest is provided', async () => {
    const sut = new LoginController();

    const httpResponse = await sut.handle();
    expect(httpResponse.statusCode).toBe(500);
  });
});
