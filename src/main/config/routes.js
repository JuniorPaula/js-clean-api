const router = require('express').Router();
const { readdirSync } = require('fs');

const setupRoutes = (app) => {
  app.use('/api', router);
  readdirSync(`${__dirname}/../routes`).map(async (file) => {
    if (!file.includes('.test.')) {
      require(`../routes/${file}`)(router);
    }
  });
};

module.exports = setupRoutes;
