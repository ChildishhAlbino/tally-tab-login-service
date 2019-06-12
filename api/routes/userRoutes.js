const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
	User.find()
		.exec()
		.then((docs) => {
			console.log(docs);
			res.status(200).json({
				message: 'Handling GET request for all users.',
				users: docs
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
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
	User.deleteOne({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'Handling DELETE request for user.',
				deletedID: id,
				deletedCount: result.deletedCount
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
		});
});

module.exports = router;
