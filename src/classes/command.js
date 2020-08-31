module.exports = class {
  constructor(message, args, prefix) {
    this.message = message;
    this.args = args.map(v => v.toLowerCase());
    this.prefix = prefix;
  }
};
