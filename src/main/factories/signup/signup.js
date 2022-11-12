const env = require('../../config/env');
const {
  CreateAccountUsecase,
} = require('../../../domain/usecases/account/create-account-usecase');

const {
  AddAccountRepository,
} = require('../../../infra/repositories/add-account-repository');

const { Encrypter } = require('../../../infra/criptography/encrypter');
const { AuthUsecase } = require('../../../domain/usecases/auth/auth-usecase');
const {
  TokenGenerator,
} = require('../../../infra/criptography/token-generator');

const {
  LoadUserByEmailRepository,
} = require('../../../infra/repositories/load-user-by-email-repository');

const {
  UpdateAccessTokenRepository,
} = require('../../../infra/repositories/update-accesstoken-repository');

const {
  SignupController,
} = require('../../../aplication/controllers/signup/signup');

const { signupFactoryValidation } = require('./signup-validation-factory');

const makeSignupController = () => {
  const salt = 12;

  const encrypter = new Encrypter(salt);
  const addAccountRepository = new AddAccountRepository();
  const loadUserByEmailRepository = new LoadUserByEmailRepository();
  const updateAccessTokenRepository = new UpdateAccessTokenRepository();
  const tokenGenerator = new TokenGenerator(env.tokeSecret);

  const createAccountUsecase = new CreateAccountUsecase(
    encrypter,
    addAccountRepository,
    loadUserByEmailRepository,
  );

  const authenticationUsecase = new AuthUsecase(
    loadUserByEmailRepository,
    encrypter,
    tokenGenerator,
    updateAccessTokenRepository,
  );

  return new SignupController(
    createAccountUsecase,
    authenticationUsecase,
    signupFactoryValidation(),
  );
};

module.exports = { makeSignupController };
