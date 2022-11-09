const validator = require('validator');
const { MissingParamError } = require('../../utils/errors');

class EmailValidatorAdapter {
  isValid(email) {
    if (!email) {
      throw new MissingParamError('email');
    }
    return validator.isEmail(email);
  }
}

module.exports = { EmailValidatorAdapter };
