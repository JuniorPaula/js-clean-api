const { MissingParamError } = require('../errors');

class RequireFieldValidator {
  constructor(fieldName) {
    this.fieldName = fieldName;
  }
  validate(input) {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName).message;
    }
  }
}

describe('RequireFieldValidator', () => {
  test('Should return a MissingParamsError if validation fails', async () => {
    const sut = new RequireFieldValidator('field');
    const error = sut.validate({ name: 'any_name' });

    expect(error).toEqual(new MissingParamError('field').message);
  });
});
