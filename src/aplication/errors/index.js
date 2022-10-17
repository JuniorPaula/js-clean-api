const { UnauthorizedError } = require('./unauthorized-error');
const { MissingParamError } = require('./missing-param-error');
const { ServerError } = require('./server-error');

module.exports = {
  UnauthorizedError,
  MissingParamError,
  ServerError,
};
