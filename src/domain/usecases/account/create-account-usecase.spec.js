const { CreateAccountUsecase } = require('./create-account-usecase');

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
  const sut = new CreateAccountUsecase(encrypterStub);

  return {
    sut,
    encrypterStub,
  };
};

describe('CreateAccountUsecase', () => {
  describe('Encrypter', () => {
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
});
