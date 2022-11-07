const {
  MissingParamError,
  InvalidParamError,
} = require('../../../utils/errors');
const { HttpResponse } = require('../../helpers/http-response');

class SignupController {
  async handle(httpRequest) {
    const { username, email, password, confirmPassword } = httpRequest.body;

    if (!username) {
      return HttpResponse.badRequest(new MissingParamError('username'));
    }

    if (!email) {
      return HttpResponse.badRequest(new MissingParamError('email'));
    }

    if (!password) {
      return HttpResponse.badRequest(new MissingParamError('password'));
    }

    if (!confirmPassword) {
      return HttpResponse.badRequest(new MissingParamError('confirmPassword'));
    }

    if (password !== confirmPassword) {
      return HttpResponse.badRequest(new InvalidParamError('confirmPassword'));
    }
  }
}

module.exports = { SignupController };
