module.exports = {
  token: 'any_token',
  id: '',
  secret: '',

  // eslint-disable-next-line no-unused-vars
  sign(id, secret) {
    this.id = id;
    this.secret = secret;
    return this.token;
  },
};
