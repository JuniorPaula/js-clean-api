module.exports = {
  token: 'any_token',

  // eslint-disable-next-line no-unused-vars
  sign(id, secret) {
    return this.token;
  },
};
