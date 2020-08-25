module.exports = class command {
  constructor(message, args, permissions) {
    this.message = message;
    this.args = args.map(v => v.toLowerCase());
    this.permissions = permissions.length <= 0 ? "No permissions" : permissions;
  }
};
