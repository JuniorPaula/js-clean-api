const { MissingParamError } = require('../../../utils/errors');
const { CreateAccountUsecase } = require('./create-account-usecase');

const mockAddAccountRepository = () => {
  class AddAccountRepositoryStub {
    async add({ username, email, password }) {
      this.username = username;
      this.email = email;
      this.password = password;

      const userData = {
        _id: 'valid_id',
        username: 'valid_username',
        email: 'valid_mail@email.com',
        password: 'hashed_1234',
      };

      return await Promise.resolve(userData);
    }
  }

  return new AddAccountRepositoryStub();
};

const mockEncrypter = () => {
  class EncrypterStub {
    async encrypt(value) {
      this.value = value;
      return await Promise.resolve('hashed_1234');
    }
  }
  return new EncrypterStub();
};

const makeSut = () => {
  const encrypterStub = mockEncrypter();
  const addAccountRepositoryStub = mockAddAccountRepository();

  const sut = new CreateAccountUsecase(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

describe('CreateAccountUsecase', () => {
  describe('Encrypter', () => {
    test('Should throws if no Encrypter is provided', async () => {
      const sut = new CreateAccountUsecase();

      const promise = sut.create({
        username: 'any_username',
        email: 'any_email@mail.com',
        password: '1234',
      });

      await expect(promise).rejects.toThrow(new MissingParamError('Encrypter'));
    });

    test('Should throws if no Encrypter has no method encrypt', async () => {
      class EncrypterStub {}
      const encrypterStub = new EncrypterStub();
      const sut = new CreateAccountUsecase(encrypterStub);

      const promise = sut.create({
        username: 'any_username',
        email: 'any_email@mail.com',
        password: '1234',
      });

      await expect(promise).rejects.toThrow(new MissingParamError('Encrypter'));
    });

    test('Should call Encrypter with correct password', async () => {
      const { sut, encrypterStub } = makeSut();
      const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');

      await sut.create({
        username: 'any_username',
        email: 'any_email@mail.com',
        password: '1234',
      });

      expect(encrypterSpy).toHaveBeenCalledWith('1234');
    });
  });

  describe('AddAccountRepository', () => {
    test('Should throws if no AddAccountRepository is provided', async () => {
      const { encrypterStub } = makeSut();

      const sut = new CreateAccountUsecase(encrypterStub);

      const promise = sut.create({
        username: 'any_username',
        email: 'any_email@mail.com',
        password: '1234',
      });

      await expect(promise).rejects.toThrow(
        new MissingParamError('AddAccountRepository'),
      );
    });

    test('Should throws if no AddAccountRepository has no method add', async () => {
      const { encrypterStub } = makeSut();

      class AddAccountRepositoryStub {}
      const addAccountRepositoryStub = new AddAccountRepositoryStub();
      const sut = new CreateAccountUsecase(
        encrypterStub,
        addAccountRepositoryStub,
      );

      const promise = sut.create({
        username: 'any_username',
        email: 'any_email@mail.com',
        password: '1234',
      });

      await expect(promise).rejects.toThrow(
        new MissingParamError('AddAccountRepository'),
      );
    });

    test('Should call AddAccountRepository with correct values', async () => {
      const { sut, addAccountRepositoryStub } = makeSut();

      const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

      await sut.create({
        username: 'any_username',
        email: 'any_email@mail.com',
        password: '1234',
      });

      expect(addSpy).toHaveBeenCalledWith({
        username: 'any_username',
        email: 'any_email@mail.com',
        password: 'hashed_1234',
      });
    });

    test('Should return a data of account on success', async () => {
      const { sut } = makeSut();

      const account = await sut.create({
        username: 'any_username',
        email: 'any_email@mail.com',
        password: '1234',
      });

      expect(account).toEqual({
        _id: 'valid_id',
        username: 'valid_username',
        email: 'valid_mail@email.com',
        password: 'hashed_1234',
      });
    });
  });
});
