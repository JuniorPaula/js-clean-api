const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../config/app');

const { MongoHelper } = require('../../infra/helpers/mongodb-helper');
let userModel;

describe('LoginRoutes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    userModel = await MongoHelper.getCollection('users');
  });

  beforeEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          username: 'Jhon Doe',
          email: 'jhon@mail.com',
          password: '123456',
          confirmPassword: '123456',
        })
        .expect(200);
    });
  });

  describe('POST /login', () => {
    test('Should return 200 when valid credentials are provided', async () => {
      await userModel.insertOne({
        email: 'jane_email@mail.com',
        name: 'Jane Doe',
        password: bcrypt.hashSync('1234', 12),
      });

      await request(app)
        .post('/api/login')
        .send({
          email: 'jane_email@mail.com',
          password: '1234',
        })
        .expect(200);
    });

    test('Should return 401 when invalid credentials are provided', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'jane_email@mail.com',
          password: '1234',
        })
        .expect(401);
    });
  });
});
