const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

router.post('/', (req, res, next) => {
	/* Takes a email and password and hashes it with BCrypt's
	hash function. Salted 10 Times.

	Returns 201 if everything worked successfully.
	Returns 409 if the email supplied already exists in the database.
	Returns 500 if an error occurred during the process.
	*/
	User.find({ email: req.body.email }).exec().then((doc) => {
		if (doc.length >= 1) {
			return res.status(409).json({
				message: 'Email already exits in database.'
			});
		} else {
			const user = new User({
				_id: new mongoose.Types.ObjectId(),
				email: req.body.email,
				passwordHash: req.body.hash
			});
			user
				.save()
				.then((result) => {
					res.status(201).json({
						message: 'Handling sign-up request',
						createdUser: user._id,
						requests: [
							{ type: 'GET', url: `localhost:3000/users/${user._id}`, verificationRequired: false },
							{ type: 'PATCH', url: `localhost:3000/users/${user._id}`, verificationRequired: true },
							{ type: 'DELETE', url: `localhost:3000/users/${user._id}`, verificationRequired: true },
							{ type: 'POST', url: `localhost:3000/login`, verificationRequired: false }
						]
					});
				})
				.catch((err) => {
					res.status(500).json({
						message: 'Error while signing up.',
						error: err
					});
				});
		}
	});
});

module.exports = router;
