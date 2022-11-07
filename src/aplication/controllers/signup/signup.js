const {
  MissingParamError,
  InvalidParamError,
  EmailAlreadyExists,
} = require('../../../utils/errors');
const { HttpResponse } = require('../../helpers/http-response');

class SignupController {
  constructor(createAccount) {
    this.createAccount = createAccount;
  }

  async handle(httpRequest) {
    try {
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
        return HttpResponse.badRequest(
          new MissingParamError('confirmPassword'),
        );
      }

      if (password !== confirmPassword) {
        return HttpResponse.badRequest(
          new InvalidParamError('confirmPassword'),
        );
      }

      const account = await this.createAccount.create({
        username,
        email,
        password,
      });

      if (!account) {
        return HttpResponse.forbiden(new EmailAlreadyExists());
      }
    } catch (error) {
      return HttpResponse.serverError();
    }
  }
}

module.exports = { SignupController };
