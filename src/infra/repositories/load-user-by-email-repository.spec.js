const { MongoHelper } = require('../helpers/mongodb-helper');
const { MissingParamError } = require('../../utils/errors');
const {
  LoadUserByEmailRepository,
} = require('./load-user-by-email-repository');

let userModel;

const makeSut = () => {
  return new LoadUserByEmailRepository();
};

describe('LoadUserByEmailRepository', () => {
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

  test('Should return null if no user if found', async () => {
    const sut = makeSut();
    const user = await sut.load('invalid_email@mail.com');

    expect(user).toBeNull();
  });

  test('Should return an user if user is found', async () => {
    const sut = makeSut();
    await userModel.insertOne({
      email: 'valid_email@mail.com',
    });

    const user = await sut.load('valid_email@mail.com');

    expect(user.email).toBe('valid_email@mail.com');
  });

  test('Should throw id not email is provided', async () => {
    const sut = makeSut();
    const promise = sut.load();

    await expect(promise).rejects.toThrow(new MissingParamError('email'));
  });
});
