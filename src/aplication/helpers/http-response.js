const {
  UnauthorizedError,
  MissingParamError,
  ServerError,
} = require('../errors');

class HttpResponse {
  static ok() {
    return {
      statusCode: 200,
    };
  }

  static badRequest(paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
    };
  }

  static serverError() {
    return {
      statusCode: 500,
      body: new ServerError(),
    };
  }

  static unauthorizedError() {
    return {
      statusCode: 401,
      body: new UnauthorizedError(),
    };
  }
}

module.exports = { HttpResponse };
