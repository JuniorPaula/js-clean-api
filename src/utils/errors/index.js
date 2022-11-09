const { InvalidParamError } = require('./invalid-param-error');
const { MissingParamError } = require('./missing-param-error');
const { EmailAlreadyExists } = require('./email-already-exists');
const { ServerError } = require('./server-error');
const { UnauthorizedError } = require('./unauthorized-error');

module.exports = {
  InvalidParamError,
  MissingParamError,
  EmailAlreadyExists,
  ServerError,
  UnauthorizedError,
};
