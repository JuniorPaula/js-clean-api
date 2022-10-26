const bcrypt = require('bcrypt');
const { MissingParamError } = require('../../utils/errors');
const { Encrypter } = require('./encrypter');

const makeSut = () => {
  return new Encrypter();
};

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = makeSut();
    const isValid = await sut.compare('any_value', 'hash');

    expect(isValid).toBe(true);
  });

  test('Should return false if bcrypt returns false', async () => {
    const sut = makeSut();
    bcrypt.isValid = false;
    const isValid = await sut.compare('any_value', 'hash');

    expect(isValid).toBe(false);
  });

  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    await sut.compare('any_value', 'hash');

    expect(bcrypt.value).toBe('any_value');
    expect(bcrypt.hash).toBe('hash');
  });

  test('Should throws if no params are provided', async () => {
    const sut = makeSut();

    await expect(sut.compare()).rejects.toThrow(new MissingParamError('value'));
    await expect(sut.compare('any_value')).rejects.toThrow(
      new MissingParamError('hash'),
    );
  });
});
