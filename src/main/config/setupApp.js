const jsonParse = require('../middlewares/json-parse');
const { cors } = require('../middlewares/cors');

const setupApp = (app) => {
  app.use(cors);
  app.use(jsonParse);
};

module.exports = { setupApp };
