const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database('./db/election.db', err => {
	if (err) {
		return console.log(err.message);
	};

	console.log('Connected to the election datatbase!');
});

module.exports = db;