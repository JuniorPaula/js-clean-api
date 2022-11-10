const { CreateAccountUsecase } = require('./create-account-usecase');

describe('CreateAccountUsecase', () => {
  describe('Encrypter', () => {
    test('Should call Encrypter with correct password', async () => {
      class EncrypterStub {
        async encrypt(value) {
          this.value = value;
          return await Promise.resolve('hashed_1234');
        }
      }

      const encrypterStub = new EncrypterStub();

      const sut = new CreateAccountUsecase(encrypterStub);

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
