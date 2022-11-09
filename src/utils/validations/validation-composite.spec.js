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

describe('ValidationComposite', () => {
  test('Should return an error if any validation fails', () => {
    const validationsSpy = [mockValidation(), mockValidation()];
    const sut = new ValidationComposite(validationsSpy);

    jest
      .spyOn(validationsSpy[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('field').message);

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field').message);
  });
});
