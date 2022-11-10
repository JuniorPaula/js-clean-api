jest.mock('bcrypt', () => ({
  isValid: true,
  async compare(value, hashValue) {
    this.value = value;
    this.hashValue = hashValue;
    return this.isValid;
  },

  async hash(value, salt) {
    this.value = value;
    this.salt = salt;
  },
}));

const bcrypt = require('bcrypt');
const { MissingParamError } = require('../../utils/errors');
const { Encrypter } = require('./encrypter');

const makeSut = () => {
  return new Encrypter();
};

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = makeSut();
    const isValid = await sut.compare('any_value', 'hashValue');

    expect(isValid).toBe(true);
  });

  test('Should return false if bcrypt returns false', async () => {
    const sut = makeSut();
    bcrypt.isValid = false;
    const isValid = await sut.compare('any_value', 'hashValue');

    expect(isValid).toBe(false);
  });

  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    await sut.compare('any_value', 'hash');

    expect(bcrypt.value).toBe('any_value');
    expect(bcrypt.hashValue).toBe('hash');
  });

  test('Should throws if no params are provided', async () => {
    const sut = makeSut();

    await expect(sut.compare()).rejects.toThrow(new MissingParamError('value'));
    await expect(sut.compare('any_value')).rejects.toThrow(
      new MissingParamError('hash'),
    );
  });

  test('Should call bcrypt.hash with correct values', async () => {
    const salt = 12;
    const sut = makeSut();

    await sut.encrypt('value', salt);

    expect(bcrypt.value).toBe('value');
    expect(bcrypt.salt).toBe(salt);
  });

  test('Should throws if no params are provided in encrypt method', async () => {
    const sut = makeSut();

    await expect(sut.encrypt()).rejects.toThrow(new MissingParamError('value'));
    await expect(sut.encrypt('any_value')).rejects.toThrow(
      new MissingParamError('salt'),
    );
  });
});
