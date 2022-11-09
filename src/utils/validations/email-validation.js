const { InvalidParamError } = require('../errors');

class EmailValidation {
  constructor(fieldName, emailValidator) {
    this.fieldName = fieldName;
    this.emailValidator = emailValidator;
  }

  validate(input) {
    const isValid = this.emailValidator.validate(input[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(this.fieldName).message;
    }
  }
}

module.exports = { EmailValidation };
