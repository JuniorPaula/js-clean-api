const { MissingParamError } = require('../../utils/errors');
const { MongoHelper } = require('../helpers/mongodb-helper');

class LoadUserByEmailRepository {
  async load(email) {
    if (!email) {
      throw new MissingParamError('email');
    }
    const db = await MongoHelper.db;
    const user = await db.collection('users').findOne({ email });
    return user;
  }
}

module.exports = { LoadUserByEmailRepository };
