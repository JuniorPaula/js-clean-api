const { MissingParamError } = require('../../../utils/errors');
const { HttpResponse } = require('../../helpers/http-response');

class SignupController {
  async handle(httpRequest) {
    const { username, email, password, confirmPassword } = httpRequest.body;

    if (!username) {
      return HttpResponse.badRequest(new MissingParamError('username'));
    }

    if (!email) {
      return HttpResponse.badRequest(new MissingParamError('email'));
    }

    if (!password) {
      return HttpResponse.badRequest(new MissingParamError('password'));
    }

    if (!confirmPassword) {
      return HttpResponse.badRequest(new MissingParamError('confirmPassword'));
    }
  }
}

describe('Signup Controller', () => {
  test('Should return 400 if no username is provided', async () => {
    const sut = new SignupController();

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      new MissingParamError('username').message,
    );
  });

  test('Should return 400 if no email is provided', async () => {
    const sut = new SignupController();

    const httpRequest = {
      body: {
        username: 'any_username',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      new MissingParamError('email').message,
    );
  });

  test('Should return 400 if no password is provided', async () => {
    const sut = new SignupController();

    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_mail@mail.com',
        confirmPassword: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      new MissingParamError('password').message,
    );
  });

  test('Should return 400 if no confirmPassword is provided', async () => {
    const sut = new SignupController();

    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_mail@mail.com',
        password: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      new MissingParamError('confirmPassword').message,
    );
  });
});
