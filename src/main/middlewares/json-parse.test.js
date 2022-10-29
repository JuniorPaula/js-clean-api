const request = require('supertest');
const { app } = require('../config/app');

describe('#JSON PARSE Middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/test_json_parse', (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .post('/test_json_parse')
      .send({ name: 'Jhon Doe' })
      .expect({ name: 'Jhon Doe' });
  });
});
