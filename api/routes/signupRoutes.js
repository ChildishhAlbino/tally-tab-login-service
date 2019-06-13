const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

router.post('/', (req, res, next) => {
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
						user: user
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
