const { UnauthorizedError, ServerError } = require('../errors');

class HttpResponse {
  static ok(data) {
    return {
      statusCode: 200,
      body: data,
    };
  }

  static badRequest(error) {
    return {
      statusCode: 400,
      body: {
        error: error.message,
      },
    };
  }

  static unauthorizedError() {
    return {
      statusCode: 401,
      body: {
        error: new UnauthorizedError().message,
      },
    };
  }

  static forbiden(error) {
    return {
      statusCode: 403,
      body: {
        error: error.message,
      },
    };
  }

  static serverError() {
    return {
      statusCode: 500,
      body: {
        error: new ServerError().message,
      },
    };
  }
}

module.exports = { HttpResponse };
