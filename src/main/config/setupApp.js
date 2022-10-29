const jsonParse = require('../middlewares/json-parse');
const { cors } = require('../middlewares/cors');
const { contentType } = require('../middlewares/content-type');

const setupApp = (app) => {
  app.use(cors);
  app.use(jsonParse);
  app.use(contentType);
};

module.exports = { setupApp };
