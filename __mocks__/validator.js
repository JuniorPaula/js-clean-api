module.exports = {
  isValidEmail: true,
  email: '',

  isEmail(email) {
    this.email = email;
    return this.isValidEmail;
  },
};
