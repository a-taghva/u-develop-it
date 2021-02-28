const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

router.get('/candidates', (req, res) => {
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

router.get('/candidates/:id', (req, res) => {
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

router.post('/candidates', ({ body }, res) => {
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

router.put('/candidate/:id', (req, res) => {
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

router.delete('/candidates/:id', (req, res) => {
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

module.exports = router;
