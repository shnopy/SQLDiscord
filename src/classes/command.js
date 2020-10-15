module.exports = class {
  constructor(message, args, prefix) {
    this.message = message;
    this.args = args.map(v => v.toLowerCase());
    this.prefix = prefix;
    this.collector = (run) => {
      let c = message.channel.createMessageCollector((m) => m.author.id === this.message.author.id, { time: 10000 });
      c.on("end", (collected) => {
        if (!collected.size) return this.message.reply("Cancelled: No reply received");
      });
      c.on("collect", async (msg) => {
        c.stop();
        if (msg.content.toLowerCase() === "cancel") return this.message.reply("Command cancelled!");
        else {
          await run(msg);
        }
      });
      return c;
    };
  }
};
