jest.mock('bcrypt', () => ({
  isValid: true,
  async compare(value, hashValue) {
    this.value = value;
    this.hashValue = hashValue;
    return this.isValid;
  },

  async hash(value) {
    this.value = value;

    return await Promise.resolve('value_hashed');
  },
}));

const bcrypt = require('bcrypt');
const { MissingParamError } = require('../../utils/errors');
const { Encrypter } = require('./encrypter');

const salt = 12;
const makeSut = () => {
  return new Encrypter(salt);
};

describe('Encrypter', () => {
  describe('#compare', () => {
    test('Should return true if bcrypt.compare returns true', async () => {
      const sut = makeSut();
      const isValid = await sut.compare('any_value', 'hashValue');

      expect(isValid).toBe(true);
    });

    test('Should return false if bcrypt.compare returns false', async () => {
      const sut = makeSut();
      bcrypt.isValid = false;
      const isValid = await sut.compare('any_value', 'hashValue');

      expect(isValid).toBe(false);
    });

    test('Should call bcrypt.compare with correct values', async () => {
      const sut = makeSut();
      await sut.compare('any_value', 'hash');

      expect(bcrypt.value).toBe('any_value');
      expect(bcrypt.hashValue).toBe('hash');
    });

    test('Should throws if no params are provided in compare method', async () => {
      const sut = makeSut();

      await expect(sut.compare()).rejects.toThrow(
        new MissingParamError('value'),
      );
      await expect(sut.compare('any_value')).rejects.toThrow(
        new MissingParamError('hash'),
      );
    });
  });

  describe('#encrypt', () => {
    test('Should call bcrypt.hash with correct values', async () => {
      const sut = makeSut();

      await sut.encrypt('value');

      expect(bcrypt.value).toBe('value');
    });

    test('Should throws if no params are provided in encrypt method', async () => {
      const sut = makeSut();

      await expect(sut.encrypt()).rejects.toThrow(
        new MissingParamError('value'),
      );
    });

    test('Should throws if no salt is provided in constructor', async () => {
      const sut = new Encrypter();

      await expect(sut.encrypt('value')).rejects.toThrow(
        new MissingParamError('salt'),
      );
    });

    test('Should throws if bcrypt.hash throws', async () => {
      const sut = makeSut();

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error();
      });

      const promise = sut.encrypt('value');

      await expect(promise).rejects.toThrow();
    });

    test('Should return a valid valueHashed if brcypt.hash succeeds', async () => {
      const sut = makeSut();

      const valueHashed = await sut.encrypt('value');

      expect(valueHashed).toBe('value_hashed');
    });
  });
});
