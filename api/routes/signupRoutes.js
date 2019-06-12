const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

router.post('/', (req, res, next) => {
	const user = new User({
		_id: new mongoose.Types.ObjectId(),
		email: req.body.email,
		hash: req.body.hash
	});
	res.status(200).json({
		message: 'Handling sign-up request',
		user: user
	});
});

module.exports = router;
