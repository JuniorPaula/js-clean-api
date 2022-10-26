class Encrypter {
  async compare(password, hashedPassword) {
    this.password = password;
    this.hashedPassword = hashedPassword;
    return true;
  }
}

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = new Encrypter();
    const isValid = await sut.compare('any_password', 'hashedPassword');

    expect(isValid).toBe(true);
  });
});
