const command = require("../classes/command");
const { readdirSync, existsSync } = require("fs");
const { MessageEmbed } = require("discord.js");
const commandDir = readdirSync(__dirname);


module.exports.main = class extends command {
  constructor(...a) {
    super(...a);
  }

  async run() {
    if (this.args[0]) {
      if (!existsSync(`${__dirname}/${this.args[0]}.js`)) return this.message.reply(`${this.args[0]} is not a command!`);
      let req = require(`${__dirname}/${this.args[0]}.js`);
      console.log(typeof this.permissions, this.permissions);
      return this.message.reply(new MessageEmbed().setTitle(this.args[0]).addFields(
        { name: "Aliases", value: req.config.aliases || "No aliases", inline: true },
        { name: "Additional Info", value: req.config.info || "No additional info", inline: true },
        { name: "Permissions", value: this.permissions, inline: true }
      ));
    }
    return this.message.reply(new MessageEmbed().addFields({ name: "Commands", value: commandDir.map((file) => file.split(".")[0]) }));
  }
};

module.exports.config = { aliases: ["h", "cmds"] };
