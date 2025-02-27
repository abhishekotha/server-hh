const mysql = require("mysql2");
require("dotenv").config();

const connectDB = () => {
  const connection = mysql.createConnection({
    host: 'localhost', // Example: 'localhost'
    user: 'root', // Example: 'root'
    password: '', // Example: 'yourpassword'
    database: 'hackhub', // Example: 'yourdatabase'
  });

  connection.connect((err) => {
    if (err) {
      console.error("❌ MySQL Connection Failed: ", err.message);
      process.exit(1);
    } else {
      console.log("✅ MySQL Connected Successfully!");
    }
  });

  return connection;
};

module.exports = connectDB;
