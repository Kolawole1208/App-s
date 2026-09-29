// db.js
const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "users.db";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to SQLite database.');
    // Create table if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        age INTEGER
      )`,
      (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        } else {
          console.log('Users table ready.');
        }
      }
    );
  }
});

module.exports = db;