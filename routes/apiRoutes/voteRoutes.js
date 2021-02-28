const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

router.post('/vote', ({ body }, res) => {
    const errors = inputCheck(body, 'voter_id', 'candidate_id');

    if (errors) {
        return res.status(400).json({ error: errors });
    };

    const sql = `INSERT INTO votes (voter_id, candidate_id) VALUES (?, ?)`;
    const params = [body.voter_id, body.candidate_id];

    db.run(sql, params, function(err, result) {
        if (err) {
            return res.status(400).json({ errors: err.message });
        };

        res.json({
            message: 'success',
            data: body,
            changes: this.lastID
        });
    });
});

router.get('/votes', (req, res) => {
    const sql = `SELECT candidates.*, parties.name, COUNT(candidate_id) AS count
                 FROM votes
                 LEFT JOIN candidates ON candidates.id = votes.candidate_id
                 LEFT JOIN parties ON parties.id = candidates.party_id
                 GROUP BY candidate_id ORDER BY count DESC;`
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

module.exports = router;

