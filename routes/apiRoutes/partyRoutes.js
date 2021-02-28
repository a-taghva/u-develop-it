const express = require('express');
const router = express.Router();
const db = require('../../db/database');

// GET all parties
router.get('/parties', (req, res) => {
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

// GET single party
router.get('/parties/:id', (req, res) => {
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

// DELETE a party
router.delete('/parties/:id', (req, res) => {
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

module.exports = router;
