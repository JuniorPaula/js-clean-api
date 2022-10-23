const { MissingParamError } = require('../../utils/errors');

class AuthUsecase {
  async auth(email, password) {
    if (!email) {
      throw new MissingParamError('email');
    }
    if (!password) {
      throw new MissingParamError('password');
    }
  }
}

describe('AuthUsecase', () => {
  test('Should throw if no email is provided', async () => {
    const sut = new AuthUsecase();
    const promise = sut.auth();

    await expect(promise).rejects.toThrow(new MissingParamError('email'));
  });

  test('Should throw if no password is provided', async () => {
    const sut = new AuthUsecase();
    const promise = sut.auth('any_email@mail.com');

    await expect(promise).rejects.toThrow(new MissingParamError('password'));
  });
});
