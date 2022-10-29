const { MongoClient } = require('mongodb');

class LoadUserByEmailRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }
  async load(email) {
    const user = await this.userModel.findOne({ email });
    return user;
  }
}

describe('LoadUserByEmailRepository', () => {
  let client;
  let db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    db = client.db();
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany();
  });

  afterAll(async () => {
    await client.close();
  });

  test('Should return null if no user if found', async () => {
    const userModel = db.collection('users');
    const sut = new LoadUserByEmailRepository(userModel);
    const user = await sut.load('invalid_email@mail.com');

    expect(user).toBeNull();
  });

  test('Should return an user if user if found', async () => {
    const userModel = db.collection('users');
    await userModel.insertOne({
      email: 'valid_email@mail.com',
    });

    const sut = new LoadUserByEmailRepository(userModel);
    const user = await sut.load('valid_email@mail.com');

    expect(user.email).toBe('valid_email@mail.com');
  });
});
