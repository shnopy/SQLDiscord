const { readdirSync } = require("fs");
module.exports = () => {
  console.log(`Bot ready! Commands: ${readdirSync(`${__dirname}/../commands`).length} Events: ${readdirSync(__dirname).length}`);
};