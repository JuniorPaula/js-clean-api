const { InvalidParamError, ServerError } = require('../errors');
const { EmailValidation } = require('./email-validation');

const mockEmailValidation = () => {
  class EmailValidationSpy {
    isValid(input) {
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

    jest.spyOn(emailValidationSpy, 'isValid').mockReturnValueOnce(false);

    const error = sut.validate({ email: 'invalid_email@mail.com' });

    expect(error).toEqual(new InvalidParamError('email').message);
  });

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidationSpy } = makeSut();

    const isValidSpy = jest.spyOn(emailValidationSpy, 'isValid');

    sut.validate({ email: 'valid_email@mail.com' });

    expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com');
  });

  test('Should return a ServerError if no fieldName is provided', () => {
    const { emailValidationSpy } = makeSut();
    const sut = new EmailValidation(emailValidationSpy);

    const error = sut.validate({ email: 'valid_email@mail.com' });

    expect(error).toBe(new ServerError().message);
  });

  test('Should return a ServerError if no EmailValidator is provided', () => {
    const sut = new EmailValidation();

    const error = sut.validate({ email: 'valid_email@mail.com' });

    expect(error).toBe(new ServerError().message);
  });

  test('Should return a ServerError if EmailValidator has no method validate', () => {
    class EmailValidatorSpy {}
    const emailValidationSpy = new EmailValidatorSpy();
    const sut = new EmailValidation('email', emailValidationSpy);

    const error = sut.validate({ email: 'valid_email@mail.com' });

    expect(error).toBe(new ServerError().message);
  });
});
