const request = require('supertest');
const { app } = require('../config/app');

describe('#ContentType Middleware', () => {
  test('Should enabled json contentType as default', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('');
    });

    await request(app).get('/test_content_type').expect('content-type', /json/);
  });
});
