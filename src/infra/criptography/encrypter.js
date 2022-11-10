const bcrypt = require('bcrypt');
const { MissingParamError } = require('../../utils/errors');

class Encrypter {
  async compare(value, hash) {
    this.value = value;
    this.hash = hash;

    if (!value) {
      throw new MissingParamError('value');
    }
    if (!hash) {
      throw new MissingParamError('hash');
    }
    const isValid = await bcrypt.compare(value, hash);

    return isValid;
  }

  async encrypt(value, salt) {
    if (!value) {
      throw new MissingParamError('value');
    }
    if (!salt) {
      throw new MissingParamError('salt');
    }

    const valueHashed = await bcrypt.hash(value, salt);
    return valueHashed;
  }
}

module.exports = { Encrypter };
