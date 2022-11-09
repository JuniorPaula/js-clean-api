const {
  EmailValidatorAdapter,
} = require('../../../infra/validators/email-validator-adapter');
const {
  RequireFieldValidator,
  EmailValidation,
  ValidationComposite,
} = require('../../../utils/validations');

const loginFactoryValidation = () => {
  const validations = [];

  for (const field of ['email', 'password']) {
    validations.push(new RequireFieldValidator(field));
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};

module.exports = { loginFactoryValidation };
