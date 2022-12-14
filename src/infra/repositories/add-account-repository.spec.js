const { MissingParamError } = require('../../utils/errors');
const { MongoHelper } = require('../helpers/mongodb-helper');
const { AddAccountRepository } = require('./add-account-repository');

let userModel;

const makeSut = () => {
  return new AddAccountRepository();
};

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
    const sut = makeSut();

    const account = await sut.add({
      username: 'john Doe',
      email: 'jhon@mail.com',
      password: '1234',
    });

    expect(account.username).toBe('john Doe');
    expect(account.email).toBe('jhon@mail.com');
    expect(account.password).toBe('1234');
  });

  test('Should throw if no params are provided', async () => {
    const sut = makeSut();

    await expect(sut.add({})).rejects.toThrow(
      new MissingParamError('username'),
    );

    await expect(sut.add({ username: 'jhon doe' })).rejects.toThrow(
      new MissingParamError('email'),
    );

    await expect(
      sut.add({ username: 'jhon doe', email: 'jhon@mail.com' }),
    ).rejects.toThrow(new MissingParamError('password'));
  });
});
