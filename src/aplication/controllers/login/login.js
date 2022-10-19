const { MissingParamError } = require('../../errors');
const { HttpResponse } = require('../../helpers/http-response');

class LoginController {
  constructor(authUsecase) {
    this.authUsecase = authUsecase;
  }

  async handle(httpRequest) {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'));
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
