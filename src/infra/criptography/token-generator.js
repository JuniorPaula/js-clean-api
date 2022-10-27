const jwt = require('jsonwebtoken');
const { MissingParamError } = require('../../utils/errors');

class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }

  async generate(id) {
    if (!this.secret) {
      throw new MissingParamError('secret');
    }
    if (!id) {
      throw new MissingParamError('id');
    }
    return jwt.sign(id, this.secret);
  }
}

module.exports = { TokenGenerator };
