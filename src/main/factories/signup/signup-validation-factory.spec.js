const {
  RequireFieldValidator,
  EmailValidation,
  ValidationComposite,
  CompareFieldValidator,
} = require('../../../utils/validations');
const { signupFactoryValidation } = require('./signup-validation-factory');

jest.mock('../../../utils/validations/validation-composite');

const mockEmailValidation = () => {
  class EmailValidationSpy {
    validate(input) {
      this.input = input;
      return true;
    }
  }

  return new EmailValidationSpy();
};

describe('Login Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    signupFactoryValidation();
    const validations = [];

    for (const field of ['username', 'email', 'password', 'confirmPassword']) {
      validations.push(new RequireFieldValidator(field));
    }

    validations.push(new CompareFieldValidator('password', 'confirmPassword'));
    validations.push(new EmailValidation('email', mockEmailValidation()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
