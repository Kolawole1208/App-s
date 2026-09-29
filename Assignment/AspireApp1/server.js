const express = require('express');
const db = require('./db'); // Import the database
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Handle form submission
app.post('/submit', (req, res) => {
  const { FirstName, SecondName, Age } = req.body;

  // Insert into database
  db.run(
    `INSERT INTO users (firstName, lastName, age) VALUES (?, ?, ?)`,
    [FirstName, SecondName, Age],
    function (err) {
      if (err) {
        console.error('Error inserting data:', err.message);
        res.send('Error saving data.');
      } else {
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.send('Data saved successfully!');
      }
    }
  );
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});