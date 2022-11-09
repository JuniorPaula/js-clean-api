const { HttpResponse } = require('../../helpers/http-response');

class LoginController {
  constructor(authUsecase, validator) {
    this.authUsecase = authUsecase;
    this.validator = validator;
  }

  async handle(httpRequest) {
    try {
      this.validator.validate(httpRequest.body);

      const { email, password } = httpRequest.body;

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
