const {
  MissingParamError,
  EmailAlreadyExists,
} = require('../../../utils/errors');
const { HttpResponse } = require('../../helpers/http-response');

class SignupController {
  constructor(createAccount, authenticationUsecase, validator) {
    this.createAccount = createAccount;
    this.authenticationUsecase = authenticationUsecase;
    this.validator = validator;
  }

  async handle(httpRequest) {
    try {
      const error = this.validator.validate(httpRequest.body);

      if (error) {
        return HttpResponse.badRequest(new MissingParamError(error));
      }

      const { username, email, password } = httpRequest.body;

      const account = await this.createAccount.create({
        username,
        email,
        password,
      });

      if (!account) {
        return HttpResponse.forbiden(new EmailAlreadyExists());
      }

      const autheticationParams = await this.authenticationUsecase.auth(
        email,
        password,
      );

      return HttpResponse.ok(autheticationParams);
    } catch (error) {
      console.log('##error', error);
      return HttpResponse.serverError();
    }
  }
}

module.exports = { SignupController };
