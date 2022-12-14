const { MissingParamError } = require('../../../utils/errors');

class AuthUsecase {
  constructor(
    loadUserByEmailRepository,
    encrypter,
    tokenGenerator,
    updateAccessTokenRepository,
  ) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  async auth(email, password) {
    if (!email) {
      throw new MissingParamError('email');
    }
    if (!password) {
      throw new MissingParamError('password');
    }
    if (
      !this.loadUserByEmailRepository ||
      !this.loadUserByEmailRepository.load
    ) {
      throw new MissingParamError('loadUserByEmailRepository');
    }
    if (!this.encrypter || !this.encrypter.compare) {
      throw new MissingParamError('Encrypter');
    }
    if (!this.tokenGenerator || !this.tokenGenerator.generate) {
      throw new MissingParamError('TokenGenerator');
    }
    if (
      !this.updateAccessTokenRepository ||
      !this.updateAccessTokenRepository.update
    ) {
      throw new MissingParamError('UpdateAccessTokenRepository');
    }

    const user = await this.loadUserByEmailRepository.load(email);

    const isValid =
      user && (await this.encrypter.compare(password, user.password));

    if (isValid) {
      const accessToken = await this.tokenGenerator.generate(user._id);
      await this.updateAccessTokenRepository.update(user._id, accessToken);

      return {
        access_token: accessToken,
        username: user.username,
      };
    }
    return null;
  }
}

module.exports = { AuthUsecase };
