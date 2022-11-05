const { MissingParamError } = require('../../utils/errors');
const { MongoHelper } = require('../helpers/mongodb-helper');
const {
  UpdateAccessTokenRepository,
} = require('./update-accesstoken-repository');

let db;

const makeSut = () => {
  return new UpdateAccessTokenRepository();
};

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
    const sut = makeSut();

    const res = await db.collection('users').insertOne({
      email: 'valid_email@mail.com',
    });

    await sut.update(res.insertedId, 'valid_token');
    const updatedFakeUser = await db
      .collection('users')
      .findOne({ _id: res.insertedId });

    expect(updatedFakeUser.accessToken).toBe('valid_token');
  });

  test('Should throw id no params are provided', async () => {
    const sut = makeSut();

    const res = await db.collection('users').insertOne({
      email: 'valid_email@mail.com',
    });

    await expect(sut.update()).rejects.toThrow(new MissingParamError('userId'));
    await expect(sut.update(res.insertedId)).rejects.toThrow(
      new MissingParamError('accessToken'),
    );
  });
});
