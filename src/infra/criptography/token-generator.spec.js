const jwt = require('jsonwebtoken');

class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }

  async generate(id) {
    this.id = id;
    return jwt.sign(id, this.secret);
  }
}

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
});
