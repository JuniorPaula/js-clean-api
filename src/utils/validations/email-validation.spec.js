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

const makeSut = () => {
  const emailValidationSpy = mockEmailValidation();
  const sut = new EmailValidation('email', emailValidationSpy);

  return {
    sut,
    emailValidationSpy,
  };
};

describe('EmailValidation', () => {
  test('Should return an error if EmailValidator return false', () => {
    const { sut, emailValidationSpy } = makeSut();

    jest.spyOn(emailValidationSpy, 'validate').mockReturnValueOnce(false);

    const error = sut.validate({ email: 'invalid_email@mail.com' });

    expect(error).toEqual(new InvalidParamError('email').message);
  });
});
