const { cors } = require('../middlewares/cors');

const setupApp = (app) => {
  app.use(cors);
};

module.exports = { setupApp };
