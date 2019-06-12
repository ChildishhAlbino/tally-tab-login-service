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
	const id = req.params.userID;
	User.findById(id)
		.exec()
		.then((doc) => {
			console.log(doc);
			res.status(200).json({
				message: 'Handling GET request for specific user',
				userInfo: doc
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
		});
});

router.patch('/:userID', (req, res, next) => {
	const id = req.params.userID;
	const patches = {};
	for (const patch of req.body) {
		patches[patch.propName] = patch.value;
	}
	User.updateOne({ _id: id }, { $set: patches })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'Handling PATCH request to change user data.',
				patchedId: id,
				appliedPatches: patches,
				result: result
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
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
