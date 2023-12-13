const mysql = require('mysql2')
require('dotenv').config();

const dB = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
)

module.exports = dB;
