const { MissingParamError } = require('../../utils/errors');

class AuthUsecase {
  constructor(loadUserByEmailRepository, encrypter, tokenGenerator) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
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

    const user = await this.loadUserByEmailRepository.load(email);

    const isValid =
      user && (await this.encrypter.compare(password, user.password));

    if (isValid) {
      const accessToken = await this.tokenGenerator.generate(user.id);
      return accessToken;
    }
    return null;
  }
}

module.exports = { AuthUsecase };
