const { InvalidParamError } = require('../errors');
const { EmailValidation } = require('./email-validation');

const mockEmailValidation = () => {
  class EmailValidationSpy {
    validate(input) {
      this.input = input;
      return true;
    }
  }

  return new EmailValidationSpy();
};

describe('EmailValidation', () => {
  test('Should return an error if EmailValidator return false', () => {
    const emailValidationSpy = mockEmailValidation();

    jest.spyOn(emailValidationSpy, 'validate').mockReturnValueOnce(false);

    const sut = new EmailValidation('email', emailValidationSpy);
    const error = sut.validate({ email: 'invalid_email@mail.com' });

    expect(error).toEqual(new InvalidParamError('email').message);
  });
});
