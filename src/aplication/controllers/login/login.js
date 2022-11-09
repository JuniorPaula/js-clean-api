const {
  MissingParamError,
  InvalidParamError,
} = require('../../../utils/errors');
const { HttpResponse } = require('../../helpers/http-response');

class LoginController {
  constructor(authUsecase, emailValidator, validator) {
    this.authUsecase = authUsecase;
    this.emailValidator = emailValidator;
    this.validator = validator;
  }

  async handle(httpRequest) {
    try {
      this.validator.validate(httpRequest.body);

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
