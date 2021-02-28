const express = require('express'); 
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 3001; 
const app = express();

const inputCheck = require('./utils/inputCheck.js');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = new sqlite3.Database('./db/election.db', err => {
	if (err) {
		return console.log(err.message);
	};

	console.log('Connected to the election datatbase!');
});

// GET all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id`;
    const params = [];

    // use all() method to retrieve all the rows
    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        };

        res.json({
            message: 'success',
            data: rows,
        });
    });
});

app.get('/api/candidates/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id
                 WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        };

        res.json({
            message: 'success',
            data: rows,
        });
    });
});

app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    const params = [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        };

        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.get('/api/parties/:id', (req, res) => {
    const sql = `SELECT * FROM parties
                 WHERE parties.id = ?`;
    const params = [req.params.id];

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        };

        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.delete('/api/candidates/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        };

        res.json({
            message: 'Successfully deleted',
            changes: this.changes,
        });
    });
});

app.delete('/api/parties/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.run(sql, params, function(err, result) {
        if (err) {
            return res.status(400).json({ error: err.message });
        };

        res.json({
            message: 'Successfully deleted',
            changes: this.changes
        });
    });
});

app.put('/api/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        return res.status(400).json({ error: errors });
    };

    const sql = `UPDATE candidates SET party_id = ?
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];

    db.run(sql, params, function(err, result) {
        if (err) {
            return res.status(400).json({ error: err.message });
        };

        res.json({
            message: 'success',
            data: req.body,
            changes: this.changes
        });
    });
});

app.post('/api/candidates', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');

    if (errors) {
        return res.status(400).json({ error: errors });
    };

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES(?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    // usint the run() method, we can execute the prepared SQL statement
    // ES5 function, not arrow function, to use 'this'
    db.run(sql, params, (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        };

        res.json({
            message: 'success',
            data: body,
            id: this.lastID
        });
    });
});

// Default response for any other requests(Not Found) Catch all
app.use((req, res) => {
	res.status(404).end();
});

// Start server after DB connection
db.on('open', () => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});
