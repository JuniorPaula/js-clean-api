const { MongoHelper } = require('../helpers/mongodb-helper');
let db;

class UpdateAccessTokenRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async update(userId, accessToken) {
    await this.userModel.updateOne(
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

describe('UpdateAccessTokenRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    db = MongoHelper.db;
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should update the user with the given access token', async () => {
    const userModel = db.collection('users');
    const sut = new UpdateAccessTokenRepository(userModel);

    const res = await userModel.insertOne({
      email: 'valid_email@mail.com',
    });

    await sut.update(res.insertedId, 'valid_token');
    const updatedFakeUser = await userModel.findOne({ _id: res.insertedId });

    expect(updatedFakeUser.accessToken).toBe('valid_token');
  });
});
