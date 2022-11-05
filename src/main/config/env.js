module.exports = {
  mongodbUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-js-api',
  port: process.env.PORT || 3033,
};
