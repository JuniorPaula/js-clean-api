const { adapterRoutes } = require('../adapters/express-routes-adapter');
const { makeLoginController } = require('../factories/login');

const loginRouter = (router) => {
  router.post('/login', adapterRoutes(makeLoginController()));
};

module.exports = loginRouter;
