const { createConnection } = require("mysql");
require("dotenv").config();

const connection = createConnection({
  host: "localhost",
  user: process.env.DBUSR,
  password: process.env.DBPSWD,
  database: "botdb"
});

connection.connect((err) => {
  if (err) throw new Error(err);
  console.log("Connected to database!");
});

module.exports = connection;