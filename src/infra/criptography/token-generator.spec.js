const jwt = require('jsonwebtoken');
const { MissingParamError } = require('../../utils/errors');
const { TokenGenerator } = require('./token-generator');

const makeSut = () => {
  return new TokenGenerator('secret');
};

describe('TokenGenerator', () => {
  test('Should return null if JWT return null', async () => {
    const sut = makeSut();
    jwt.token = null;
    const token = await sut.generate('any_id');

    expect(token).toBeNull();
  });

  test('Should return a token if JWT return token', async () => {
    const sut = makeSut();
    const token = await sut.generate('any_id');

    expect(token).toBe(jwt.token);
  });

  test('Should call JWT with correct values', async () => {
    const sut = makeSut();
    await sut.generate('any_id');

    expect(jwt.id).toBe('any_id');
    expect(jwt.secret).toBe(sut.secret);
  });

  test('Should throw if no secret is provided', async () => {
    const sut = new TokenGenerator();
    const promise = sut.generate('any_id');

    await expect(promise).rejects.toThrow(new MissingParamError('secret'));
  });

  test('Should throw if no id is provided', async () => {
    const sut = makeSut();
    const promise = sut.generate();

    await expect(promise).rejects.toThrow(new MissingParamError('id'));
  });
});
