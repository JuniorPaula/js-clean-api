const { MongoHelper } = require('../helpers/mongodb-helper');

class AddAccountRepository {
  async add({ username, email, password }) {
    const userModel = await MongoHelper.getCollection('users');
    const res = await userModel.insertOne({ username, email, password });
    const user = await userModel.findOne({ _id: res.insertedId });
    console.log('user', user);
    return user;
  }
}
let userModel;

describe('AddAccountRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    userModel = await MongoHelper.getCollection('users');
  });

  beforeEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should return an account on success', async () => {
    const sut = new AddAccountRepository();

    const account = await sut.add({
      username: 'john Doe',
      email: 'jhon@mail.com',
      password: '1234',
    });

    expect(account.username).toBe('john Doe');
    expect(account.email).toBe('jhon@mail.com');
    expect(account.password).toBe('1234');
  });
});
