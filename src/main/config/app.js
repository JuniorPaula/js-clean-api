const express = require('express');
const { setupApp } = require('./setupApp');

const app = express();

setupApp(app);

module.exports = app;
