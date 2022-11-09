const {
  RequireFieldValidator,
  EmailValidation,
  ValidationComposite,
} = require('../../../utils/validations');
const { loginFactoryValidation } = require('./login-validation-factory');

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
    loginFactoryValidation();
    const validations = [];

    for (const field of ['email', 'password']) {
      validations.push(new RequireFieldValidator(field));
    }

    validations.push(new EmailValidation('email', mockEmailValidation()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
