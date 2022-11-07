const { InvalidParamError } = require('./invalid-param-error');
const { MissingParamError } = require('./missing-param-error');
const { EmailAlreadyExists } = require('./email-already-exists');

module.exports = {
  InvalidParamError,
  MissingParamError,
  EmailAlreadyExists,
};
