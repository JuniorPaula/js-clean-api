const { MissingParamError } = require('../../../utils/errors');

class CreateAccountUsecase {
  constructor(encrypter, addAccountRepository) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async create({ username, email, password }) {
    if (!this.encrypter || !this.encrypter.encrypt) {
      throw new MissingParamError('Encrypter');
    }

    if (!this.addAccountRepository || !this.addAccountRepository.add) {
      throw new MissingParamError('AddAccountRepository');
    }

    const hashedPassword = await this.encrypter.encrypt(password);

    this.addAccountRepository.add({
      username,
      email,
      password: hashedPassword,
    });
  }
}

module.exports = { CreateAccountUsecase };
