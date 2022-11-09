const { UnauthorizedError, ServerError } = require('../../../utils/errors');
const { LoginController } = require('./login');

const mockValidator = () => {
  class ValidatorSpy {
    validate(input) {
      this.email = input.email;
      this.password = input.password;

      return null;
    }
  }

  return new ValidatorSpy();
};

const mockAuthUsecaseError = () => {
  class AuthUsecaseSpy {
    async auth() {
      throw new Error();
    }
  }
  return new AuthUsecaseSpy();
};

const mockAuthUsecase = () => {
  class AuthUsecaseSpy {
    async auth(email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }
  const authUsecaseSpy = new AuthUsecaseSpy();
  authUsecaseSpy.accessToken = 'valid_accessToken';
  return authUsecaseSpy;
};

const makeSut = () => {
  const authUsecaseSpy = mockAuthUsecase();
  const validatorSpy = mockValidator();

  const sut = new LoginController(authUsecaseSpy, validatorSpy);

  return {
    sut,
    authUsecaseSpy,
    validatorSpy,
  };
};

describe('LoginController', () => {
  describe('HttpRequest Params', () => {
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
  });

  describe('AuthUsecase', () => {
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
      const { sut, authUsecaseSpy } = makeSut();
      authUsecaseSpy.accessToken = null;
      const httpRequest = {
        body: {
          email: 'invalid_email@mail.com',
          password: 'invalid_password',
        },
      };

      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(401);
      expect(httpResponse.body.error).toBe(new UnauthorizedError().message);
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
      expect(httpResponse.body.error).toBe(new ServerError().message);
    });

    test('Should return 500 if authUsecase has no auth method', async () => {
      class AuthUsecaseSpy {}
      const authUsecaseSpy = new AuthUsecaseSpy();
      const sut = new LoginController(authUsecaseSpy);
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password',
        },
      };

      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.error).toBe(new ServerError().message);
    });

    test('Should return 500 if AuthUsecase throws', async () => {
      const authUsecaseSpyError = mockAuthUsecaseError();
      const sut = new LoginController(authUsecaseSpyError);

      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password',
        },
      };

      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.error).toEqual(new ServerError().message);
    });

    test('Should return 200 if valid credentials are provided', async () => {
      const { sut, authUsecaseSpy } = makeSut();

      const httpRequest = {
        body: {
          email: 'valid_email@mail.com',
          password: 'valid_password',
        },
      };

      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(200);
      expect(httpResponse.body.accessToken).toEqual(authUsecaseSpy.accessToken);
    });
  });

  describe('Validator', () => {
    test('Should call Validator with correct values', async () => {
      const { sut, validatorSpy } = makeSut();
      const httpRequest = {
        body: {
          email: 'valid_mail@mail.com',
          password: '1234',
        },
      };

      await sut.handle(httpRequest);

      expect(validatorSpy.email).toBe(httpRequest.body.email);
      expect(validatorSpy.password).toBe(httpRequest.body.password);
    });
  });
});
