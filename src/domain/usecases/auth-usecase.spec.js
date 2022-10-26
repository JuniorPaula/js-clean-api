const { MissingParamError } = require('../../utils/errors');
const { AuthUsecase } = require('./auth-usecase');

const mockTokenGenerator = () => {
  class TokenGerenatorStub {
    async generate(userId) {
      this.userId = userId;
      return this.accessToken;
    }
  }

  const tokenGerenatorStub = new TokenGerenatorStub();
  tokenGerenatorStub.accessToken = 'any_accessToken';
  return tokenGerenatorStub;
};

const mockEncrypter = () => {
  class EncrypterStub {
    async compare(password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
      return this.isValid;
    }
  }

  const encrypterStub = new EncrypterStub();
  encrypterStub.isValid = true;

  return encrypterStub;
};

const mockLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositoryStub {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }

  const loadUserByEmailRepositoryStub = new LoadUserByEmailRepositoryStub();
  loadUserByEmailRepositoryStub.user = {
    id: 'any_id',
    password: 'hashedPassword',
  };

  return loadUserByEmailRepositoryStub;
};

const makeSut = () => {
  const loadUserByEmailRepositoryStub = mockLoadUserByEmailRepository();
  const encrypterStub = mockEncrypter();
  const tokenGeneratorStub = mockTokenGenerator();

  const sut = new AuthUsecase(
    loadUserByEmailRepositoryStub,
    encrypterStub,
    tokenGeneratorStub,
  );

  return {
    sut,
    loadUserByEmailRepositoryStub,
    encrypterStub,
    tokenGeneratorStub,
  };
};

describe('AuthUsecase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut();
    const promise = sut.auth();

    await expect(promise).rejects.toThrow(new MissingParamError('email'));
  });

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut();
    const promise = sut.auth('any_email@mail.com');

    await expect(promise).rejects.toThrow(new MissingParamError('password'));
  });

  test('Should call loadUserByEmail with correct email', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut();
    await sut.auth('any_email@mail.com', 'any_password');

    expect(loadUserByEmailRepositoryStub.email).toBe('any_email@mail.com');
  });

  test('Should throw if no loadUserByEmailRepository is provided', async () => {
    const sut = new AuthUsecase();
    const promise = sut.auth('any_email@mail.com', 'any_password');

    await expect(promise).rejects.toThrow(
      new MissingParamError('loadUserByEmailRepository'),
    );
  });

  test('Should throw if loadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUsecase({});
    const promise = sut.auth('any_email@mail.com', 'any_password');

    await expect(promise).rejects.toThrow(
      new MissingParamError('loadUserByEmailRepository'),
    );
  });

  test('Should throw if no Encrypter is provided', async () => {
    const loadUserByEmailRepository = mockLoadUserByEmailRepository();
    const sut = new AuthUsecase(loadUserByEmailRepository);
    const promise = sut.auth('any_email@mail.com', 'any_password');

    await expect(promise).rejects.toThrow(new MissingParamError('Encrypter'));
  });

  test('Should throw if no Encrypter has no compare method', async () => {
    const loadUserByEmailRepository = mockLoadUserByEmailRepository();
    const sut = new AuthUsecase(loadUserByEmailRepository, {});

    const promise = sut.auth('any_email@mail.com', 'any_password');

    await expect(promise).rejects.toThrow(new MissingParamError('Encrypter'));
  });

  test('Should throw if no TokenGeneration is provided', async () => {
    const loadUserByEmailRepository = mockLoadUserByEmailRepository();
    const encrypterStub = mockEncrypter();
    const sut = new AuthUsecase(loadUserByEmailRepository, encrypterStub);

    const promise = sut.auth('any_email@mail.com', 'any_password');

    await expect(promise).rejects.toThrow(
      new MissingParamError('TokenGenerator'),
    );
  });

  test('Should throw if TokenGeneration has no generate method', async () => {
    const loadUserByEmailRepository = mockLoadUserByEmailRepository();
    const encrypterStub = mockEncrypter();
    const sut = new AuthUsecase(loadUserByEmailRepository, encrypterStub, {});

    const promise = sut.auth('any_email@mail.com', 'any_password');

    await expect(promise).rejects.toThrow(
      new MissingParamError('TokenGenerator'),
    );
  });

  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut();
    loadUserByEmailRepositoryStub.user = null;
    const accessToken = await sut.auth(
      'invalid_email@mail.com',
      'any_password',
    );

    expect(accessToken).toBeNull();
  });

  test('Should return null if an invalid password is provided', async () => {
    const { sut, encrypterStub } = makeSut();
    encrypterStub.isValid = false;

    const accessToken = await sut.auth(
      'valid_email@mail.com',
      'invalid_password',
    );

    expect(accessToken).toBeNull();
  });

  test('Should call Encrypter with correct valeus', async () => {
    const { sut, loadUserByEmailRepositoryStub, encrypterStub } = makeSut();
    await sut.auth('valid_email@mail.com', 'any_password');

    expect(encrypterStub.password).toBe('any_password');
    expect(encrypterStub.hashedPassword).toBe(
      loadUserByEmailRepositoryStub.user.password,
    );
  });

  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositoryStub, tokenGeneratorStub } =
      makeSut();

    await sut.auth('valid_email@mail.com', 'valid_password');

    expect(tokenGeneratorStub.userId).toBe(
      loadUserByEmailRepositoryStub.user.id,
    );
  });

  test('Should return an accessToken if correct credentials is provided', async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    const accessToken = await sut.auth(
      'valid_email@mail.com',
      'valid_password',
    );

    expect(accessToken).toBe(tokenGeneratorStub.accessToken);
    expect(accessToken).toBeTruthy();
  });

  test('Should throws if LoadUserByEmailRepository throws', async () => {
    class LoadUserByEmailRepositoryError {
      load(email) {
        this.email = email;
        throw new Error();
      }
    }
    const loadUserByEmail = new LoadUserByEmailRepositoryError();
    const sut = new AuthUsecase(loadUserByEmail);

    const promise = sut.auth('valid_email@mail.com', 'valid_password');

    await expect(promise).rejects.toThrow();
  });

  test('Should throws if Encrypter throws', async () => {
    class EncrypterError {
      compare(password, hashedPassword) {
        this.password = password;
        this.hashedPassword = hashedPassword;
        throw new Error();
      }
    }
    const encrypter = new EncrypterError();
    const sut = new AuthUsecase(encrypter);

    const promise = sut.auth('valid_email@mail.com', 'valid_password');

    await expect(promise).rejects.toThrow();
  });
});
