const connection = require("../functions/connect");
const { MessageEmbed } = require("discord.js");

module.exports = {
  //eslint-disable-next-line no-unused-vars
  async run(message, args) {
    if (args[0] === "show") {
      connection.query(`SELECT * FROM todos WHERE userid = ${message.author.id}`, (error, result) => {
        if (!result.length) return message.reply("You have no current todos!");
        if (error) throw new Error(error);
        result.forEach((row) => {
          message.author.send(new MessageEmbed().addFields({ name: "Todo:", value: row.todo, inline: true }, { name: "Date:", value: new Date(row.date).toDateString(), inline: true }).setFooter(`Unique ID: ${row.pk}`));
        });
        message.reply(`Sent: ${result.length} todos`);
      });
      return;
    } else if (args[0] === "remove") {
      message.reply("Please give the id of the todo you wish to remove (`cancel` to cancel command)");
      let collector = message.channel.createMessageCollector((m) => m.author.id === message.author.id, { time: 10000 });

      collector.on("collect", (msg) => {
        collector.stop();
        if (msg.content.toLowerCase() === "cancel") return message.reply("Command cancelled!");
        connection.query(`DELETE FROM todos WHERE pk=${msg.content} AND userid=${msg.author.id}`, (error, result) => {
          if (error && (error.code === "ER_BAD_FIELD_ERROR" || error.code === "ER_PARSE_ERROR")) return message.reply(`No todo exists with id: \`${msg.content}\``);
          else if (error) throw new Error(error);
          if (!result.affectedRows) return message.reply(`You do not have a todo with the id: ${msg.content}`);
          message.reply(`Deleted todo with id: ${msg.content}`);
        });
      });
      return;
    }
    message.reply("Please give the todo that you would like to add (`cancel` to cancel command)");
    let collector = message.channel.createMessageCollector((m) => m.author.id === message.author.id, { time: 10000 });

    collector.on("collect", (msg) => {
      collector.stop();
      if (msg.content.toLowerCase() === "cancel") return message.reply("Command cancelled!");
      connection.query(`INSERT INTO todos (todo,userid,date) VALUES ("${msg.content}",${msg.author.id},${Date.now()})`, (error) => {
        if (error) throw new Error(error);
        message.reply(`Added todo: ${msg.content}`);
      });
    });

    collector.on("end", (collected) => {
      if (!collected.size) return message.reply("Cancelled: No reply recieved");
    });
  },
  config: {
    aliases: ["remindme", "remind"],
    info: ["`show`: Shows all active todos", "`remove`: Removes an active todo"]
  }
};