const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Initialize database
const db = new sqlite3.Database('form_data.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        
        // Create table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            age INTEGER,
            country TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                console.log('Users table ready');
            }
        });
    }
});

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { fullname, email, password, age, country } = req.body;
    
    // Simple validation
    if (!fullname || !email || !password) {
        return res.status(400).send(`
            <div class="message error">All required fields must be filled</div>
            <p><a href="/">Go back to form</a></p>
        `);
    }
    
    // Hash password (simple hash for demo purposes)
    const hashedPassword = require('crypto').createHash('sha256').update(password).digest('hex');
    
    // Insert into database
    const sql = `INSERT INTO users (fullname, email, password, age, country) 
                 VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [fullname, email, hashedPassword, age, country], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Error</title>
                    <link rel="stylesheet" href="/style.css">
                </head>
                <body>
                    <div class="container">
                        <div class="message error">Error: ${err.message}</div>
                        <p><a href="/">Go back to registration form</a></p>
                    </div>
                </body>
                </html>
            `);
        }
        
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Success</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <div class="container">
                    <div class="message success">
                        <h2>Registration Successful!</h2>
                        <p>User registered successfully with ID: ${this.lastID}</p>
                    </div>
                    <p><a href="/">Register another user</a></p>
                    <p><a href="/view-data">View all registered users</a></p>
                </div>
            </body>
            </html>
        `);
    });
});

// Route to view all data
app.get('/view-data', (req, res) => {
    db.all("SELECT * FROM users ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            return res.status(500).send('Error retrieving data');
        }
        
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Registered Users</title>
                <link rel="stylesheet" href="/style.css">
                <style>
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #f8f9fa; font-weight: bold; }
                    tr:hover { background-color: #f5f5f5; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Registered Users</h1>
                    <p><a href="/">Back to registration form</a></p>
        `;
        
        if (rows.length === 0) {
            html += `<p>No users registered yet.</p>`;
        } else {
            html += `
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Country</th>
                        <th>Registered</th>
                    </tr>
            `;
            
            rows.forEach(row => {
                html += `
                    <tr>
                        <td>${row.id}</td>
                        <td>${row.fullname}</td>
                        <td>${row.email}</td>
                        <td>${row.age || 'N/A'}</td>
                        <td>${row.country || 'N/A'}</td>
                        <td>${new Date(row.created_at).toLocaleString()}</td>
                    </tr>
                `;
            });
            
            html += `</table>`;
        }
        
        html += `</div></body></html>`;
        res.send(html);
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Form available at: http://localhost:${port}/`);
    console.log(`View data at: http://localhost:${port}/view-data`);
});