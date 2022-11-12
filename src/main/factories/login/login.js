const env = require('../../config/env');
const {
  LoginController,
} = require('../../../aplication/controllers/login/login');
const { AuthUsecase } = require('../../../domain/usecases/auth/auth-usecase');
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

const { loginFactoryValidation } = require('./login-validation-factory');

const makeLoginController = () => {
  const loadUserByEmailRepository = new LoadUserByEmailRepository();
  const encrypter = new Encrypter();
  const tokenGenerator = new TokenGenerator(env.tokeSecret);
  const updateAccessTokenRepository = new UpdateAccessTokenRepository();

  const authUsecase = new AuthUsecase(
    loadUserByEmailRepository,
    encrypter,
    tokenGenerator,
    updateAccessTokenRepository,
  );

  return new LoginController(authUsecase, loginFactoryValidation());
};

module.exports = { makeLoginController };
