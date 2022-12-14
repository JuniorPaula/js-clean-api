const { MissingParamError } = require('../errors');
const { RequireFieldValidator } = require('./require-field-validator');

const makeSut = () => {
  return new RequireFieldValidator('field');
};

describe('RequireFieldValidator', () => {
  test('Should return a MissingParamsError if validation fails', async () => {
    const sut = makeSut();
    const error = sut.validate({ name: 'any_name' });

    expect(error).toEqual(new MissingParamError('field').message);
  });

  test('Should not return an error if validation succeeds', async () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'any_name' });

    expect(error).toBeFalsy();
  });
});
