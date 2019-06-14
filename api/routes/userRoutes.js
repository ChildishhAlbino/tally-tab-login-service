const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res, next) => {
	/* Retrieves all users from the database and returns them in an array nested inside a JSON Object3
	--------------------------------------------------------------
	Returns 200 if everything worked successfully.
	Returns 500 if an error occurred during the process.
	*/
	User.find()
		.select('_id email passwordHash')
		.exec()
		.then((docs) => {
			res.status(200).json({
				message: 'Handling GET request for all users.',
				totalUserCount: docs.length,
				users: docs.map(({ _id }) => {
					return {
						userID: _id,
						requests: [ { type: 'GET', url: `/users/${_id}`, validationRequired: false } ]
					};
				})
			});
		})
		.catch((err) => {
			next(err);
		});
});

router.get('/:userID', (req, res, next) => {
	const id = req.params.userID;
	User.findById(id)
		.select('_id email passwordHash')
		.exec()
		.then((doc) => {
			if (doc) {
				res.status(200).json({
					message: 'Handling GET request for specific user',
					userInfo: doc
				});
			} else {
				res.status(404).json({
					message: 'No user found with that ID'
				});
			}
		})
		.catch((err) => {
			next(err);
		});
});

router.patch('/:userID', (req, res, next) => {
	const id = req.params.userID;
	const patches = req.body.patches;
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
			next(err);
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
			next(err);
		});
});

module.exports = router;
