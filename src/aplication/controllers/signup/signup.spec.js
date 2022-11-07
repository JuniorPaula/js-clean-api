const {
  MissingParamError,
  InvalidParamError,
} = require('../../../utils/errors');
const { ServerError } = require('../../errors');

const { SignupController } = require('./signup');

const mockCreateAccount = () => {
  class CreateAccountSpy {
    async create({ username, email, password }) {
      this.username = username;
      this.email = email;
      this.password = password;
    }
  }

  return new CreateAccountSpy();
};

const makeSut = () => {
  const createAccountSpy = mockCreateAccount();
  const sut = new SignupController(createAccountSpy);

  return {
    sut,
    createAccountSpy,
  };
};

describe('Signup Controller', () => {
  test('Should return 400 if no username is provided', async () => {
    const { sut } = makeSut();

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
    const { sut } = makeSut();

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
    const { sut } = makeSut();

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
    const { sut } = makeSut();

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

  test('Should return 400 if password not match with confirmPassword', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_mail@mail.com',
        password: '1234',
        confirmPassword: '123',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      new InvalidParamError('confirmPassword').message,
    );
  });

  test('Should return 500 if no HttpRequest is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle();
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe(new ServerError().message);
  });

  test('Should return 500 if HttpRequest has no body', async () => {
    const { sut } = makeSut();
    const httpRequest = {};

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe(new ServerError().message);
  });

  test('Should call createAccount with correct values', async () => {
    const { sut, createAccountSpy } = makeSut();
    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_mail@mail.com',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    await sut.handle(httpRequest);
    expect(createAccountSpy.username).toBe(httpRequest.body.username);
    expect(createAccountSpy.email).toBe(httpRequest.body.email);
    expect(createAccountSpy.password).toBe(httpRequest.body.password);
  });
});
