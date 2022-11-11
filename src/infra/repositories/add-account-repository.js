const { MissingParamError } = require('../../utils/errors');
const { MongoHelper } = require('../helpers/mongodb-helper');

class AddAccountRepository {
  async add({ username, email, password }) {
    if (!username) {
      throw new MissingParamError('username');
    }

    if (!email) {
      throw new MissingParamError('email');
    }

    if (!password) {
      throw new MissingParamError('password');
    }

    const userModel = await MongoHelper.getCollection('users');
    const res = await userModel.insertOne({ username, email, password });
    const user = await userModel.findOne({ _id: res.insertedId });

    return user;
  }
}

module.exports = { AddAccountRepository };
