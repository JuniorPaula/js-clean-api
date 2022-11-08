const { InvalidParamError } = require('../errors');

class CompareFieldValidator {
  constructor(fieldName, fieldNameToCompare) {
    this.fieldName = fieldName;
    this.fieldNameToCompare = fieldNameToCompare;
  }
  validate(input) {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldNameToCompare).message;
    }
  }
}

const makeSut = () => {
  return new CompareFieldValidator('field', 'fieldToCompare');
};

describe('CompareFieldValidator', () => {
  test('Should return InvalidParamsError if validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value',
    });

    expect(error).toEqual(new InvalidParamError('fieldToCompare').message);
  });

  test('Should not return an error if validation succeeds', () => {
    const sut = makeSut();

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value',
    });

    expect(error).toBeFalsy();
  });
});
