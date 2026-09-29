const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the current directory (where server.js is located)
app.use(express.static(__dirname));

// Database initialization
let db;
const dbPath = './pharmacy.db';

function initializeDatabase() {
    // Close existing database connection if any
    if (db) {
        db.close();
    }

    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the pharmacy database.');
            createTables();
        }
    });
}

function createTables() {
    console.log('Creating tables if they don\'t exist...');
    
    db.serialize(() => {
        // Create drugs table
        db.run(`CREATE TABLE IF NOT EXISTS drugs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 0,
            price REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating drugs table:', err.message);
            } else {
                console.log('Drugs table verified/created successfully');
                
                // Check if we need to insert sample data
                db.get("SELECT COUNT(*) as count FROM drugs", (err, row) => {
                    if (err) {
                        console.error('Error checking drugs table:', err.message);
                    } else if (row.count === 0) {
                        console.log('Inserting sample data...');
                        db.run(`INSERT INTO drugs (name, category, quantity, price) VALUES 
                            ('Paracetamol', 'Analgesics', 100, 300),
                            ('Amoxicillin', 'Antibiotics', 50, 500),
                            ('Ibuprofen', 'Analgesics', 75, 600),
                            ('Losartan', 'Antihypertensives', 30, 1000),
                            ('Metformin', 'Antidiabetics', 40, 1500),
                            ('Vitamin C', 'Vitamins', 200, 600)`);
                    }
                });
            }
        });

        // Create transactions table
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            buyerName TEXT NOT NULL,
            processedBy TEXT NOT NULL,
            totalAmount REAL NOT NULL,
            transactionDate TEXT NOT NULL,
            drugs TEXT NOT NULL,
            status TEXT DEFAULT 'Completed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating transactions table:', err.message);
            } else {
                console.log('Transactions table verified/created successfully');
            }
        });
    });
}

// Update the root route to serve pharmacist.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pharmacist.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API status endpoint
app.get('/api', (req, res) => {
    res.json({ message: 'Pharmacy Management System API is running' });
});

// API Endpoints

// Get all drugs
app.get('/api/drugs', (req, res) => {
    db.all("SELECT * FROM drugs ORDER BY name", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get single drug
app.get('/api/drugs/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM drugs WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Drug not found' });
            return;
        }
        res.json(row);
    });
});

// Add new drug
app.post('/api/drugs', (req, res) => {
    const { name, category, quantity, price } = req.body;
    
    if (!name || !category || quantity === undefined || price === undefined) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    db.run(
        "INSERT INTO drugs (name, category, quantity, price) VALUES (?, ?, ?, ?)",
        [name, category, quantity, price],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ 
                id: this.lastID, 
                name, 
                category, 
                quantity, 
                price,
                message: 'Drug added successfully' 
            });
        }
    );
});

// Update drug
app.put('/api/drugs/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, quantity, price } = req.body;
    
    db.run(
        "UPDATE drugs SET name = ?, category = ?, quantity = ?, price = ? WHERE id = ?",
        [name, category, quantity, price, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Drug not found' });
                return;
            }
            res.json({ message: 'Drug updated successfully' });
        }
    );
});

// Delete drug
app.delete('/api/drugs/:id', (req, res) => {
    const { id } = req.params;
    
    db.run("DELETE FROM drugs WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Drug not found' });
            return;
        }
        res.json({ message: 'Drug deleted successfully' });
    });
});

// Get all transactions
app.get('/api/transactions', (req, res) => {
    db.all("SELECT * FROM transactions ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get single transaction
app.get('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM transactions WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Transaction not found' });
            return;
        }
        res.json(row);
    });
});

// Add new transaction
app.post('/api/transactions', (req, res) => {
    const { buyerName, processedBy, totalAmount, transactionDate, drugs, status } = req.body;
    
    if (!buyerName || !processedBy || !totalAmount || !transactionDate || !drugs) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    db.run(
        "INSERT INTO transactions (buyerName, processedBy, totalAmount, transactionDate, drugs, status) VALUES (?, ?, ?, ?, ?, ?)",
        [buyerName, processedBy, totalAmount, transactionDate, JSON.stringify(drugs), status || 'Completed'],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ 
                id: this.lastID, 
                message: 'Transaction added successfully' 
            });
        }
    );
});

// Update transaction
app.put('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    const { buyerName, processedBy, totalAmount, transactionDate, drugs, status } = req.body;
    
    db.run(
        "UPDATE transactions SET buyerName = ?, processedBy = ?, totalAmount = ?, transactionDate = ?, drugs = ?, status = ? WHERE id = ?",
        [buyerName, processedBy, totalAmount, transactionDate, JSON.stringify(drugs), status, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Transaction not found' });
                return;
            }
            res.json({ message: 'Transaction updated successfully' });
        }
    );
});

// Delete transaction
app.delete('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    
    db.run("DELETE FROM transactions WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Transaction not found' });
            return;
        }
        res.json({ message: 'Transaction deleted successfully' });
    });
});

// Initialize database and start server
initializeDatabase();

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Frontend should be available at http://localhost:${PORT}`);
});

// Keep the process alive
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        if (db) {
            db.close((err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Database connection closed.');
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export for testing
module.exports = app;