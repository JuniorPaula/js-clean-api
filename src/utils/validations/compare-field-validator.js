const { InvalidParamError } = require('../errors');

class CompareFieldValidator {
  constructor(fieldName, fieldNameToCompare) {
    this.fieldName = fieldName;
    this.fieldNameToCompare = fieldNameToCompare;
  }
  validate(input) {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldNameToCompare).message;
    }
  }
}

module.exports = { CompareFieldValidator };
