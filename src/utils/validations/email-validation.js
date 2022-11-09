const { InvalidParamError, ServerError } = require('../errors');

class EmailValidation {
  constructor(fieldName, emailValidator) {
    this.fieldName = fieldName;
    this.emailValidator = emailValidator;
  }

  validate(input) {
    try {
      const isValid = this.emailValidator.validate(input[this.fieldName]);
      if (!isValid) {
        return new InvalidParamError(this.fieldName).message;
      }
    } catch (error) {
      return new ServerError().message;
    }
  }
}

module.exports = { EmailValidation };
