const { MissingParamError } = require('../../../utils/errors');

class CreateAccountUsecase {
  constructor(encrypter, addAccountRepository) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async create({ username, email, password }) {
    this.username = username;
    this.email = email;

    if (!this.encrypter || !this.encrypter.encrypt) {
      throw new MissingParamError('Encrypter');
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
