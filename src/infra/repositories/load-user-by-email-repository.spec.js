class LoadUserByEmailRepository {
  // eslint-disable-next-line no-unused-vars
  async load(email) {
    return null;
  }
}

describe('LoadUserByEmailRepository', () => {
  test('Should return null if no user if found', async () => {
    const sut = new LoadUserByEmailRepository();
    const user = await sut.load('invalid_email@mail.com');

    expect(user).toBeNull();
  });
});
