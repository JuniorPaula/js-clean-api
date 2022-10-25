const { MissingParamError, InvalidParamError } = require('../../utils/errors');

class AuthUsecase {
  constructor(loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
  }

  async auth(email, password) {
    if (!email) {
      throw new MissingParamError('email');
    }
    if (!password) {
      throw new MissingParamError('password');
    }
    if (!this.loadUserByEmailRepository) {
      throw new MissingParamError('loadUserByEmailRepository');
    }
    if (!this.loadUserByEmailRepository.load) {
      throw new InvalidParamError('loadUserByEmailRepository');
    }

    const user = await this.loadUserByEmailRepository.load(email);

    if (!user) {
      return null;
    }

    return null;
  }
}

module.exports = { AuthUsecase };
