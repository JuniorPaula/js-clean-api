module.exports = {
  mongodbUrl: process.env.MONGO_URL || '',
  port: process.env.PORT || 3033,
  tokeSecret: process.env.TOKEN_SECRET || '',
};
