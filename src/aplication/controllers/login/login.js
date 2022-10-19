const { MissingParamError, InvalidParamError } = require('../../errors');
const { HttpResponse } = require('../../helpers/http-response');

class LoginController {
  constructor(authUsecase, emailValidator) {
    this.authUsecase = authUsecase;
    this.emailValidator = emailValidator;
  }

  async handle(httpRequest) {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'));
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'));
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'));
      }

      const accessToken = await this.authUsecase.auth(email, password);
      if (!accessToken) {
        return HttpResponse.unauthorizedError();
      }

      return HttpResponse.ok({ accessToken });
    } catch (error) {
      return HttpResponse.serverError();
    }
  }
}

module.exports = { LoginController };
