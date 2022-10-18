const { MissingParamError, UnauthorizedError } = require('../../errors');
const { LoginController } = require('./login');

const makeSut = () => {
  class AuthUsecaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
    }
  }
  const authUsecaseSpy = new AuthUsecaseSpy();
  const sut = new LoginController(authUsecaseSpy);

  return {
    sut,
    authUsecaseSpy,
  };
};

describe('LoginController', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
    const { sut } = makeSut();

    const httpResponse = await sut.handle();
    expect(httpResponse.statusCode).toBe(500);
  });

  test('Should return 500 if HttpRequest has no body', async () => {
    const { sut } = makeSut();
    const httpRequest = {};

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  test('Should call AuthUsecase with correct params', async () => {
    const { sut, authUsecaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
      },
    };

    await sut.handle(httpRequest);
    expect(authUsecaseSpy.email).toBe(httpRequest.body.email);
    expect(authUsecaseSpy.password).toBe(httpRequest.body.password);
  });

  test('Should return 401 when invalid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'invalid_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test('Should return 500 if no authUsecase is provided', async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });
});
