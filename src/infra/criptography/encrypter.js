const bcrypt = require('bcrypt');

class Encrypter {
  async compare(value, hash) {
    this.value = value;
    this.hash = hash;
    const isValid = await bcrypt.compare(value, hash);

    return isValid;
  }
}

module.exports = { Encrypter };
