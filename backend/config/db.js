const mysql = require('mysql2');
require('dotenv').config(); // ✅ Load .env variables

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('✅ MySQL connected');
});

module.exports = connection;
