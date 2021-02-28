const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

router.get('/voters', (req, res) => {
    const sql = `SELECT * FROM voters ORDER BY last_name`;
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

router.get('/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`;
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        };

        res.json({
            message: 'success',
            data: row
        });
    });
});

router.post('/voter', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');

    if (errors) {
        return res.status(400).json({ error: errors });
    };

    const sql = `INSERT INTO voters (first_name, last_name, email)
                 VALUES(?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.email];

    db.run(sql, params, function(err, result) {
        if (err) {
            return res.status(400).json({ error: err.message });
        };

        res.json({
            message: 'success',
            data: body,
            changes: this.changes
        });
    });
});

router.put('/voter/:id', (req, res) => {
    const errors = inputCheck(req.body, 'email');

    if (errors) {
        return res.status(400).json({ error: errors });
    };

    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id];

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


module.exports = router;

