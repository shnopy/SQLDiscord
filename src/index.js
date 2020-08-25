const { Client, Collection } = require("discord.js");
const { readdirSync, existsSync } = require("fs");
const connection = require("./functions/connect");
require("dotenv").config();
const client = new Client({ disableEveryone: true });
const events = readdirSync(`${__dirname}/events`).filter((f) => f.endsWith(".js"));
const commands = readdirSync(`${__dirname}/commands`).filter((f) => f.endsWith(".js"));

if (commands.length <= 0) console.error("No commands found!");
if (events.length <= 0) console.error("No events found!");
client.Commands = new Collection();
client.CommandAliases = new Collection();

commands.forEach((file) => {
  let required = require(`${__dirname}/commands/${file}`);
  if (!required.main) throw new Error(`Command: ${file} has no run function!`);
  if (!required.config) throw new Error(`Command: ${file} has no config!`);
  if (!required.config.aliases) console.log(`Command: ${file} has no aliases`);
  let noext = file.split(".")[0];
  client.Commands.set(noext, required.main);
  required.config.aliases.forEach((a) => { if (a !== noext) client.CommandAliases.set(a, noext); else { throw new Error(`${file} has an alias of its self`); } });
  console.log(`Starting permissions check for: ${noext}`);
  connection.query(`SELECT command FROM permissions WHERE command = "${noext}"`, (error, result) => {
    if (error) throw new Error(result);
    if (!result.length) {
      connection.query(`INSERT INTO permissions (command) VALUES ("${noext}")`, (error) => {
        if (error) throw new Error(error);
        console.log(`Added permission for: ${noext}`);
      });
    } else {
      if (!existsSync(`${__dirname}/commands/${file}`)) connection.query(`DELETE FROM permissions WHERE command = "${noext}"`, (error) => {
        if (error) throw new Error(error);
        console.log(`Removed permission for: ${noext}`);
      });
    }
  });

});



events.forEach(evt => {
  client.on(evt.split(".")[0], require(`${__dirname}/events/${evt}`));
});


client.login(process.env.TOKEN)
  .catch(err => { throw new Error(err); });
