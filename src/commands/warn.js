const command = require("../classes/command");
const connection = require("../functions/connect");
const { MessageEmbed } = require("discord.js");

module.exports.main = class extends command {
  constructor(...a) {
    super(...a);
  }

  async run() {
    let user;
    this.message.reply("Please provide a user id (`cancel` to cancel command)").then(() => {
      this.collector(async (msg) => {
        if (isNaN(parseInt(msg.content))) return this.message.reply("You must provide a userid");
        user = await this.message.client.users.fetch(msg.content).then(user => {
          return { username: user.username, id: user.id };
        });
      });
    });
    this.message.reply("Please provide a warning reason (`cancel` to cancel command)").then(() => {
      this.collector(async (msg) => {
        console.log(`${user.id},${this.message.guild.id},${msg.content},${this.message.author.id},${Date.now()}`);
        connection.query(`INSERT INTO warnings (userid,guildid,warning,warner,date) VALUES (${user.id},${this.message.guild.id},"${msg.content}",${this.message.author.id},${Date.now()})`, (error) => {
          if (error) throw new Error(error);
          this.message.reply(new MessageEmbed().addFields({ name: "Warned:", value: user.username, inline: true }, { name: "Reason:", value: msg.content, inline: true }));
        });
      });
    });
  }
};

module.exports.config = {
  aliases: ["warning"]
};