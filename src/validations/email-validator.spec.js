class EmailValidator {
  // eslint-disable-next-line no-unused-vars
  isValid(email) {
    return true;
  }
}

describe('EmailValidator', () => {
  test('Should return true if validator return true', () => {
    const sut = new EmailValidator();
    const isValidEmail = sut.isValid('valid_email@mail.com');

    expect(isValidEmail).toBe(true);
  });
});
