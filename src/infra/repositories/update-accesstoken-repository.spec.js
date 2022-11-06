const { MissingParamError } = require('../../utils/errors');
const { MongoHelper } = require('../helpers/mongodb-helper');
const {
  UpdateAccessTokenRepository,
} = require('./update-accesstoken-repository');

let userModel;

const makeSut = () => {
  return new UpdateAccessTokenRepository();
};

describe('UpdateAccessTokenRepository', () => {
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

  test('Should update the user with the given access token', async () => {
    const sut = makeSut();

    const res = await userModel.insertOne({
      email: 'valid_email@mail.com',
    });

    await sut.update(res.insertedId, 'valid_token');
    const updatedFakeUser = await userModel.findOne({ _id: res.insertedId });

    expect(updatedFakeUser.accessToken).toBe('valid_token');
  });

  test('Should throw if no params are provided', async () => {
    const sut = makeSut();

    const res = await userModel.insertOne({
      email: 'valid_email@mail.com',
    });

    await expect(sut.update()).rejects.toThrow(new MissingParamError('userId'));
    await expect(sut.update(res.insertedId)).rejects.toThrow(
      new MissingParamError('accessToken'),
    );
  });
});
