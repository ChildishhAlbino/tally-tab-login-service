const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

router.post('/', (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then((doc) => {
			console.log(doc);
			if (doc.length != 0) {
				return res.status(500).json({
					message: 'Email already exits in database.'
				});
			} else {
				const user = new User({
					_id: new mongoose.Types.ObjectId(),
					email: req.body.email,
					passwordHash: req.body.hash
				});
				result = user.save();
				res.status(201).json({
					message: 'Handling sign-up request',
					user: user
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: 'Error while signing up.',
				error: err
			});
		});
});

module.exports = router;
