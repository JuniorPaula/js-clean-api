const {
  MissingParamError,
  InvalidParamError,
  EmailAlreadyExists,
} = require('../../../utils/errors');
const { ServerError } = require('../../errors');

const { SignupController } = require('./signup');

const mockValidator = () => {
  class ValidatorSpy {
    validate(input) {
      this.username = input.username;
      this.email = input.email;
      this.password = input.password;
      this.confirmPassword = input.confirmPassword;
      return null;
    }
  }

  return new ValidatorSpy();
};

const mockauthenticationUsecaseSpy = () => {
  class AuthenticationUsecaseSpy {
    async auth(email, password) {
      this.email = email;
      this.password = password;
      return {
        access_token: this.accessToken,
        username: this.username,
      };
    }
  }
  const authenticationUsecaseSpy = new AuthenticationUsecaseSpy();
  authenticationUsecaseSpy.accessToken = 'valid_accessToken';
  authenticationUsecaseSpy.username = 'valid_username';
  return authenticationUsecaseSpy;
};

const mockauthenticationUsecaseSpyError = () => {
  class AuthenticationUsecaseSpy {
    async auth(email, password) {
      this.email = email;
      this.password = password;
      throw new Error();
    }
  }

  return new AuthenticationUsecaseSpy();
};

const mockCreateAccountSpyError = () => {
  class CreateAccountSpy {
    async create({ username, email, password }) {
      this.username = username;
      this.email = email;
      this.password = password;

      throw new Error();
    }
  }

  return new CreateAccountSpy();
};

const mockCreateAccount = () => {
  class CreateAccountSpy {
    async create({ username, email, password }) {
      this.username = username;
      this.email = email;
      this.password = password;

      return {
        id: 'valid_id',
        username: 'valid_username',
        email: 'valid_mail@mail.com',
        password: '1234',
      };
    }
  }

  return new CreateAccountSpy();
};

const makeSut = () => {
  const createAccountSpy = mockCreateAccount();
  const authenticationUsecaseSpy = mockauthenticationUsecaseSpy();
  const validatorSpy = mockValidator();
  const sut = new SignupController(
    createAccountSpy,
    authenticationUsecaseSpy,
    validatorSpy,
  );

  return {
    sut,
    createAccountSpy,
    authenticationUsecaseSpy,
    validatorSpy,
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

  test('Should return 500 if no CreateAccount is provided', async () => {
    const sut = new SignupController();
    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_mail@mail.com',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe(new ServerError().message);
  });

  test('Should return 500 if CreateAccount has no method create', async () => {
    class CreateAccountSpy {}
    const createAccountSpy = new CreateAccountSpy();
    const sut = new SignupController(createAccountSpy);
    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_mail@mail.com',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe(new ServerError().message);
  });

  test('Should return 500 if CreateAccount throws', async () => {
    const createAccountSpyError = mockCreateAccountSpyError();
    const sut = new SignupController(createAccountSpyError);

    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_mail@mail.com',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toEqual(new ServerError().message);
  });

  test('Should return 403 if CreateAccount returns null', async () => {
    const { sut, createAccountSpy } = makeSut();

    jest.spyOn(createAccountSpy, 'create').mockReturnValueOnce(null);

    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_mail@mail.com',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body.error).toBe(new EmailAlreadyExists().message);
  });

  test('Should call AuthenticationUsecase with correct params', async () => {
    const { sut, authenticationUsecaseSpy } = makeSut();
    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_mail@mail.com',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    await sut.handle(httpRequest);
    expect(authenticationUsecaseSpy.email).toBe(httpRequest.body.email);
    expect(authenticationUsecaseSpy.password).toBe(httpRequest.body.password);
  });

  test('Should return 500 if no AuthenticationUsecase is provided', async () => {
    const sut = new SignupController();
    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_mail@mail.com',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe(new ServerError().message);
  });

  test('Should return 500 if AuthenticationUsecase has no method create', async () => {
    class AuthenticationUsecaseSpy {}
    const authenticationUsecase = new AuthenticationUsecaseSpy();
    const sut = new SignupController(authenticationUsecase);
    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_mail@mail.com',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe(new ServerError().message);
  });

  test('Should return 500 if AuthenticationUsecase throws', async () => {
    const authenticationUsecaseSpy = mockauthenticationUsecaseSpyError();
    const sut = new SignupController(authenticationUsecaseSpy);

    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_mail@mail.com',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toEqual(new ServerError().message);
  });

  test('Should return 200 valid data are provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        username: 'valid_username',
        email: 'valid_mail@mail.com',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      access_token: 'valid_accessToken',
      username: 'valid_username',
    });
  });

  test('Should call Validator with correct values', async () => {
    const { sut, validatorSpy } = makeSut();
    const httpRequest = {
      body: {
        username: 'valid_username',
        email: 'valid_mail@mail.com',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    await sut.handle(httpRequest);

    expect(validatorSpy.username).toBe(httpRequest.body.username);
    expect(validatorSpy.email).toBe(httpRequest.body.email);
    expect(validatorSpy.password).toBe(httpRequest.body.password);
    expect(validatorSpy.confirmPassword).toBe(httpRequest.body.confirmPassword);
  });

  test('Should return 400 Validator return an error', async () => {
    const { sut, validatorSpy } = makeSut();
    jest
      .spyOn(validatorSpy, 'validate')
      .mockReturnValueOnce(new Error('any_field').message);

    const httpRequest = {
      body: {
        username: 'valid_username',
        email: 'valid_mail@mail.com',
        password: '1234',
        confirmPassword: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      new MissingParamError('any_field').message,
    );
  });
});
