const { MissingParamError } = require('../../../utils/errors');

class CreateAccountUsecase {
  constructor(encrypter) {
    this.encrypter = encrypter;
  }

  async create({ username, email, password }) {
    this.username = username;
    this.email = email;

    if (!this.encrypter) {
      throw new MissingParamError('Encrypter');
    }
    await this.encrypter.encrypt(password);
  }
}

module.exports = { CreateAccountUsecase };
