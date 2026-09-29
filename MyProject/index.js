const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to School Management Backend!');
});

// Register student route
app.post('/register', (req, res) => {
  const student = req.body;

  // Save data to a file called students.json
  fs.readFile('students.json', 'utf8', (err, data) => {
    let students = [];

    if (!err && data) {
      students = JSON.parse(data);
    }

    students.push(student);

    fs.writeFile('students.json', JSON.stringify(students, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to save student.');
      }

      res.send('Student registered successfully!');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
