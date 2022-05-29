const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  database: "avicennaDb",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
});

module.exports = { pool };
