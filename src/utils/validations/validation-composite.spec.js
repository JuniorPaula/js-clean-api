const { MissingParamError } = require('../errors');

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
    class ValidationComposite {
      constructor(validations = []) {
        this.validations = validations;
      }

      validate(input) {
        for (const validation of this.validations) {
          const error = validation.validate(input);
          if (error) {
            return error;
          }
        }
      }
    }
    const validationsSpy = [mockValidation(), mockValidation()];
    const sut = new ValidationComposite(validationsSpy);

    jest
      .spyOn(validationsSpy[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('field').message);

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field').message);
  });
});
