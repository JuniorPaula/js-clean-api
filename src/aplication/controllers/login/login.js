const { HttpResponse } = require('../../helpers/http-response');

class LoginController {
  constructor(authUsecase) {
    this.authUsecase = authUsecase;
  }

  async handle(httpRequest) {
    if (
      !httpRequest ||
      !httpRequest.body ||
      !this.authUsecase ||
      !this.authUsecase.auth
    ) {
      return HttpResponse.serverError();
    }
    const { email, password } = httpRequest.body;
    if (!email) {
      return HttpResponse.badRequest('email');
    }
    if (!password) {
      return HttpResponse.badRequest('password');
    }

    this.authUsecase.auth(email, password);
    return HttpResponse.unauthorizedError();
  }
}

module.exports = { LoginController };
