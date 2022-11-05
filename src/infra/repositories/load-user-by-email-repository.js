const { MissingParamError } = require('../../utils/errors');
const { MongoHelper } = require('../helpers/mongodb-helper');

class LoadUserByEmailRepository {
  async load(email) {
    if (!email) {
      throw new MissingParamError('email');
    }
    const userModel = await MongoHelper.getCollection('users');
    const user = await userModel.findOne({ email });
    return user;
  }
}

module.exports = { LoadUserByEmailRepository };
