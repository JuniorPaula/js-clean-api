const env = require('../../config/env');
const {
  LoginController,
} = require('../../../aplication/controllers/login/login');
const { AuthUsecase } = require('../../../domain/usecases/auth-usecase');
const { EmailValidator } = require('../../utils/validations/email-validator');
const {
  LoadUserByEmailRepository,
} = require('../../../infra/repositories/load-user-by-email-repository');
const {
  UpdateAccessTokenRepository,
} = require('../../../infra/repositories/update-accesstoken-repository');
const { Encrypter } = require('../../../infra/criptography/encrypter');
const {
  TokenGenerator,
} = require('../../../infra/criptography/token-generator');

const makeLoginController = () => {
  const loadUserByEmailRepository = new LoadUserByEmailRepository();
  const encrypter = new Encrypter();
  const tokenGenerator = new TokenGenerator(env.tokeSecret);
  const updateAccessTokenRepository = new UpdateAccessTokenRepository();

  const emailValidator = new EmailValidator();
  const authUsecase = new AuthUsecase(
    loadUserByEmailRepository,
    encrypter,
    tokenGenerator,
    updateAccessTokenRepository,
  );
  return new LoginController(authUsecase, emailValidator);
};

module.exports = { makeLoginController };
