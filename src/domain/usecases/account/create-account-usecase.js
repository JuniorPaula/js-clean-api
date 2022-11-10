class CreateAccountUsecase {
  constructor(encrypter) {
    this.encrypter = encrypter;
  }

  async create({ username, email, password }) {
    this.username = username;
    this.email = email;

    await this.encrypter.encrypt(password);
  }
}

module.exports = { CreateAccountUsecase };
