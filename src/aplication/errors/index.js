const { UnauthorizedError } = require('./unauthorized-error');
const { MissingParamError } = require('./missing-param-error');
const { InvalidParamError } = require('./invalid-param-error');
const { ServerError } = require('./server-error');

module.exports = {
  UnauthorizedError,
  MissingParamError,
  InvalidParamError,
  ServerError,
};
