const {
  EmailValidatorAdapter,
} = require('../../../infra/validators/email-validator-adapter');
const {
  RequireFieldValidator,
  EmailValidation,
  ValidationComposite,
  CompareFieldValidator,
} = require('../../../utils/validations');

const signupFactoryValidation = () => {
  const validations = [];

  for (const field of ['username', 'email', 'password', 'confirmPassword']) {
    validations.push(new RequireFieldValidator(field));
  }

  validations.push(new CompareFieldValidator('password', 'confirmPassword'));
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};

module.exports = { signupFactoryValidation };
