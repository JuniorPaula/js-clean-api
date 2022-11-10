class CreateAccountUsecase {
  constructor(encrypter) {
    this.encrypter = encrypter;
  }

  async create({ username, email, password }) {
    this.username = username;
    this.email = email;

    await this.encrypter.encrypt(password);
  }
}

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
