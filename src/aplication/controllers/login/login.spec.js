class LoginController {
  async handle(httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError();
    }
    const { email, password } = httpRequest.body;
    if (!email) {
      return HttpResponse.badRequest('email');
    }
    if (!password) {
      return HttpResponse.badRequest('password');
    }
  }
}

class HttpResponse {
  static badRequest(paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
    };
  }

  static serverError() {
    return {
      statusCode: 500,
    };
  }
}

class MissingParamError extends Error {
  constructor(paramName) {
    super(`Missing param: ${paramName}`);
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
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
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
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 500 if no HttpRequest is provided', async () => {
    const sut = new LoginController();

    const httpResponse = await sut.handle();
    expect(httpResponse.statusCode).toBe(500);
  });

  test('Should return 500 if HttpRequest has no body', async () => {
    const sut = new LoginController();
    const httpRequest = {};

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });
});
