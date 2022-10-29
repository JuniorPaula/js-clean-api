const request = require('supertest');
const { app } = require('../config/app');

describe('#ContentType Middleware', () => {
  test('Should enabled json contentType as default', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('');
    });

    await request(app).get('/test_content_type').expect('content-type', /json/);
  });

  test('Should return #xml content-type it forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml');
      res.send('');
    });

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/);
  });
});
