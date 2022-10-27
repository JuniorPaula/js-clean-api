const jwt = require('jsonwebtoken');

class TokenGenerator {
  async generate(id) {
    this.id = id;
    return jwt.sign(id, 'secret');
  }
}

describe('TokenGenerator', () => {
  test('Should return null if JWT return null', async () => {
    const sut = new TokenGenerator();
    jwt.token = null;
    const token = await sut.generate('any_id');

    expect(token).toBeNull();
  });

  test('Should return a token if JWT return token', async () => {
    const sut = new TokenGenerator();
    const token = await sut.generate('any_id');

    expect(token).toBe(jwt.token);
  });
});
