module.exports = class {
  constructor(message, args, permissions, prefix) {
    this.message = message;
    this.args = args.map(v => v.toLowerCase());
    this.permissions = permissions.length <= 0 ? "No permissions" : permissions;
    this.prefix = prefix;
  }
};
