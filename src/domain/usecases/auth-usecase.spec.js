const { MissingParamError } = require('../../utils/errors');

class AuthUsecase {
  async auth(email) {
    if (!email) {
      throw new MissingParamError('email');
    }
  }
}

describe('AuthUsecase', () => {
  test('Should throw if no email is provided', async () => {
    const sut = new AuthUsecase();
    const promise = sut.auth();

    await expect(promise).rejects.toThrow(new MissingParamError('email'));
  });
});
