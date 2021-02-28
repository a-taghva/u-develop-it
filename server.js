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
    const sql = `SELECT * FROM candidates`;
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
    const sql = `SELECT * FROM candidates WHERE id = ?`;
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

app.delete('/api/candidates/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        };

        res.json({
            message: 'success',
            changes: this.changes,
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

// db.all(`SELECT * FROM candidates`, (err, rows) => {
// 	console.log(rows)
// });

// // GET a single candidate 
// db.get(`SELECT * FROM candidates WHERE id = 2`, (err, row) => {
// 	if (err) {
// 		return console.log(err);
// 	};

	// console.log(row);
// });

// // DELETE a candidate
// db.run(`DELETE FROM candidates WHERE id = ?`, 1, function(err, result) {
//     if (err) {
//         return console.log(err);
//     };

    // console.log(result, this, this.changes, this.sql);
// });

// // Create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//     VALUES(?, ?, ?, ?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// // ES5 functino, not arrow function, to use 'this'
// db.run(sql, params, function(err, result) {
//     if (err) {
//         return console.log(err);
//     };

    // console.log(result, this.lastID);
// });

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
