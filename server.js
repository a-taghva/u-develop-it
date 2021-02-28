const express = require('express'); 
const db = require('./db/database');

const PORT = process.env.PORT || 3001; 
const app = express();

const inputCheck = require('./utils/inputCheck.js');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// GET all candidates
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
