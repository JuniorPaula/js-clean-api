module.exports = {
  mongodbUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-js-api',
  port: process.env.PORT || 3033,
  tokeSecret: process.env.TOKEN_SECRET || 'sdj38db827t45kjsbd$%asd31247$%#gfsg',
};
