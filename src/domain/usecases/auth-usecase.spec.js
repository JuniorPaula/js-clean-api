class AuthUsecase {
  async auth(email) {
    if (!email) {
      throw new Error();
    }
  }
}

describe('AuthUsecase', () => {
  test('Should throw if no email is provided', async () => {
    const sut = new AuthUsecase();
    const promise = sut.auth();

    await expect(promise).rejects.toThrow();
  });
});
