const {
  MissingParamError,
  InvalidParamError,
} = require('../../../utils/errors');

const { SignupController } = require('./signup');

const makeSut = () => {
  const sut = new SignupController();

  return {
    sut,
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
});
