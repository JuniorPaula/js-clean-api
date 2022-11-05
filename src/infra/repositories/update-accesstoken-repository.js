const { MissingParamError } = require('../../utils/errors');
const { MongoHelper } = require('../helpers/mongodb-helper');

class UpdateAccessTokenRepository {
  async update(userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId');
    }

    if (!accessToken) {
      throw new MissingParamError('accessToken');
    }
    const userModel = await MongoHelper.getCollection('users');
    await userModel.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          accessToken,
        },
      },
    );
  }
}

module.exports = { UpdateAccessTokenRepository };
