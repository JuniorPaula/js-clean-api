const { MissingParamError, InvalidParamError } = require('../../utils/errors');
const { AuthUsecase } = require('./auth-usecase');

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
    password: 'hashedPassword',
  };

  return loadUserByEmailRepositoryStub;
};

const makeSut = () => {
  const loadUserByEmailRepositoryStub = mockLoadUserByEmailRepository();
  const encrypterStub = mockEncrypter();

  const sut = new AuthUsecase(loadUserByEmailRepositoryStub, encrypterStub);

  return {
    sut,
    loadUserByEmailRepositoryStub,
    encrypterStub,
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
      new InvalidParamError('loadUserByEmailRepository'),
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
});
