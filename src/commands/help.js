const command = require("../classes/command");
const connection = require("../functions/connect");
const { readdirSync, existsSync } = require("fs");
const { MessageEmbed } = require("discord.js");
const commandDir = readdirSync(__dirname);

function getPermissions(cmd, r) {
  connection.query(`SELECT permission FROM permissions WHERE command="${cmd}"`, (error, result) => {
    if (error) throw new Error(error);
    return r(result[0].permission || "No permission");
  });
}

module.exports.main = class extends command {
  constructor(...a) {
    super(...a);
  }

  async run() {
    if (this.args[0]) {
      if (!existsSync(`${__dirname}/${this.args[0]}.js`)) return this.message.reply(`${this.args[0]} is not a command!`);
      let req = require(`${__dirname}/${this.args[0]}.js`);
      return getPermissions(this.args[0], (permissions) => {
        this.message.reply(new MessageEmbed().setTitle(this.args[0]).addFields({ name: "Aliases", value: req.config.aliases, inline: true }, { name: "Additional Info", value: req.config.info || "No additional info", inline: true }, { name: "Permissions", value: permissions, inline: true }));
      });
    }
    this.message.reply(new MessageEmbed().addFields({ name: "Commands", value: commandDir.map((file) => file.split(".")[0]) }));
  }
};

module.exports.config = { aliases: ["h", "cmds"] };


/*module.exports = {
  //eslint-disable-next-line no-unused-vars
  async run(this.message, this.args) {
    if (this.args[0]) {
      if (!existsSync(`${__dirname}/${this.args[0]}.js`)) return this.message.reply(`${this.args[0]} is not a command!`);
      let req = require(`${__dirname}/${this.args[0]}.js`);
      return getPermissions(this.args[0], (permissions) => {
        this.message.reply(new MessageEmbed().setTitle(this.args[0]).addFields({ name: "Aliases", value: req.config.aliases, inline: true }, { name: "Additional Info", value: req.config.info || "No additional info", inline: true }, { name: "Permissions", value: permissions, inline: true }));
      });
    }
    this.message.reply(new MessageEmbed().addFields({ name: "Commands", value: commandDir.map((file) => file.split(".")[0]) }));
  },
  config: {
    aliases: ["h", "cmds"]
  }
};*/