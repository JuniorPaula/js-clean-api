const express = require('express');
const { setupApp } = require('./setupApp');

const setupRoutes = require('./routes');

const app = express();

setupApp(app);
setupRoutes(app);

module.exports = app;
