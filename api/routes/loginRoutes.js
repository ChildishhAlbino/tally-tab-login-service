const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
	// Takes a username and a password and returns a JWT token
	// if the username and password are a valid combination.
	res.status(200).json({
		message: 'Handling login request'
	});
});

module.exports = router;
