const connection = require("../functions/connect");
const { existsSync } = require("fs");

function getPrefix(prefix) {
  connection.query("SELECT value FROM settings WHERE setting = 'prefix'", (error, result) => {
    if (error) throw new Error(error);
    if (result.length <= 0) throw new Error("Prefix does not exist in table");
    return prefix(result[0].value);
  });
}

module.exports = async (message) => {
  getPrefix((prefix) => {
    if (!message.author.bot && message.content.includes(prefix) && message.channel.type !== "dm") {
      let args = message.content.slice(prefix.length).split(/\s/g);
      let command = args.shift().toLocaleLowerCase();
      let commandreal = message.client.Commands.get(message.client.CommandAliases.get(command) || command);
      if (commandreal) {
        connection.query(`SELECT permission FROM permissions WHERE command="${existsSync(`${__dirname}/../commands/${command}.js`) ? command : message.client.CommandAliases.get(command)}"`, (error, result) => {
          if (error) throw new Error(error);

          let neededperms = result[0].permission ? result[0].permission.split(",") : [];
          if (message.member.hasPermission(neededperms, { checkAdmin: false, checkOwner: false })) return new commandreal(message, args, prefix).run();
          else message.reply(`Need:\n\`${neededperms.join("\n")}\``);
        });
      }
    }
  });
};