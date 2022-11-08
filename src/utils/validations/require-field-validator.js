const { MissingParamError } = require('../errors');

class RequireFieldValidator {
  constructor(fieldName) {
    this.fieldName = fieldName;
  }
  validate(input) {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName).message;
    }
  }
}

module.exports = { RequireFieldValidator };
