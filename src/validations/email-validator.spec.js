const validator = require('validator');

class EmailValidator {
  isValid(email) {
    return validator.isEmail(email);
  }
}

describe('EmailValidator', () => {
  test('Should return true if validator return true', () => {
    const sut = new EmailValidator();
    const isValidEmail = sut.isValid('valid_email@mail.com');

    expect(isValidEmail).toBe(true);
  });

  test('Should return false if validator return false', () => {
    validator.isValidEmail = false;
    const sut = new EmailValidator();
    const isValidEmail = sut.isValid('invalid_email@mail.com');

    expect(isValidEmail).toBe(false);
  });
});
