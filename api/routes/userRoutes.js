const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Handling GET request for all users.'
	});
});

router.get('/:userID', (req, res, next) => {
	res.status(200).json({
		message: 'Handling GET userID request'
	});
});

router.patch('/:userID', (req, res, next) => {
	res.status(200).json({
		message: 'Handling PATCH request to change user data.',
		id: id
	});
});

router.delete('/:userID', (req, res, next) => {
	const id = req.params.userID;
	res.status(200).json({
		message: 'Handling DELETE request for given ID',
		id: id
	});
});

module.exports = router;
