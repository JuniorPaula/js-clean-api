const { MissingParamError } = require('../../../utils/errors');

class CreateAccountUsecase {
  constructor(encrypter, addAccountRepository, loadUserByEmailRepository) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
    this.loadUserByEmailRepository = loadUserByEmailRepository;
  }

  async create({ username, email, password }) {
    if (!this.encrypter || !this.encrypter.encrypt) {
      throw new MissingParamError('Encrypter');
    }

    if (!this.addAccountRepository || !this.addAccountRepository.add) {
      throw new MissingParamError('AddAccountRepository');
    }

    if (!this.loadUserByEmailRepository) {
      throw new MissingParamError('LoadUserByEmailRepository');
    }

    const hashedPassword = await this.encrypter.encrypt(password);

    const account = await this.addAccountRepository.add({
      username,
      email,
      password: hashedPassword,
    });

    return account;
  }
}

module.exports = { CreateAccountUsecase };
