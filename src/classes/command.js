module.exports = class command {
  constructor(message, args) {
    (this.message = message), (this.args = args);
  }
};
