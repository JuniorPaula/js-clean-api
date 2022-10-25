const { MissingParamError } = require('../../utils/errors');

class AuthUsecase {
  constructor(loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
  }

  async auth(email, password) {
    if (!email) {
      throw new MissingParamError('email');
    }
    if (!password) {
      throw new MissingParamError('password');
    }
    if (!this.loadUserByEmailRepository) {
      throw new MissingParamError('loadUserByEmailRepository');
    }

    await this.loadUserByEmailRepository.load(email);
  }
}

const makeSut = () => {
  class LoadUserByEmailRepositoryStub {
    async load(email) {
      this.email = email;
    }
  }

  const loadUserByEmailRepositoryStub = new LoadUserByEmailRepositoryStub();
  const sut = new AuthUsecase(loadUserByEmailRepositoryStub);

  return {
    sut,
    loadUserByEmailRepositoryStub,
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
});
