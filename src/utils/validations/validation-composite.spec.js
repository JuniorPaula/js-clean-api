const { MissingParamError } = require('../errors');
const { ValidationComposite } = require('./validation-composite');

const mockValidation = () => {
  class ValidationsSpy {
    validate(input) {
      this.input = input;
      return null;
    }
  }

  return new ValidationsSpy();
};

const makeSut = () => {
  const validationsSpy = [mockValidation(), mockValidation()];
  const sut = new ValidationComposite(validationsSpy);

  return {
    sut,
    validationsSpy,
  };
};

describe('ValidationComposite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationsSpy } = makeSut();

    jest
      .spyOn(validationsSpy[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('field').message);

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field').message);
  });

  test('Should returns the first error if more than one validation fails', () => {
    const { sut, validationsSpy } = makeSut();

    jest.spyOn(validationsSpy[0], 'validate').mockReturnValueOnce(new Error());

    jest
      .spyOn(validationsSpy[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field').message);

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new Error());
  });

  test('Should not return an any error if validation succeeds', () => {
    const { sut } = makeSut();

    const error = sut.validate({ field: 'any_value' });

    expect(error).toBeFalsy();
  });
});
