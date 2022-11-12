const { adapterRoutes } = require('../adapters/express-routes-adapter');
const { makeLoginController } = require('../factories/login/login');
const { makeSignupController } = require('../factories/signup/signup');

const loginRouter = (router) => {
  router.post('/login', adapterRoutes(makeLoginController()));
  router.post('/signup', adapterRoutes(makeSignupController()));
};

module.exports = loginRouter;
