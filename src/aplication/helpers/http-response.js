const { MissingParamError } = require('../errors/missing-param-error');

class HttpResponse {
  static badRequest(paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
    };
  }

  static serverError() {
    return {
      statusCode: 500,
    };
  }

  static unauthorizedError() {
    return {
      statusCode: 401,
    };
  }
}

module.exports = { HttpResponse };
