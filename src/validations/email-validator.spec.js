const validator = require('validator');
const { EmailValidator } = require('./email-validator');

const makeSut = () => {
  return new EmailValidator();
};

describe('EmailValidator', () => {
  test('Should return true if validator return true', () => {
    const sut = makeSut();
    const isValidEmail = sut.isValid('valid_email@mail.com');

    expect(isValidEmail).toBe(true);
  });

  test('Should return false if validator return false', () => {
    validator.isValidEmail = false;
    const sut = makeSut();
    const isValidEmail = sut.isValid('invalid_email@mail.com');

    expect(isValidEmail).toBe(false);
  });

  test('Should call validator with correct email', () => {
    const sut = makeSut();
    sut.isValid('any_email@mail.com');

    expect(validator.email).toBe('any_email@mail.com');
  });
});
