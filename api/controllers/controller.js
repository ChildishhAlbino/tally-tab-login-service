const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SIGNUP_ROUTINE = async (req, res, next) => {
	/* 
    * Check if user exists in database already, return 409 if true.
    * If false, hash their password.
    * Store the user
    * Return 200 if all worked
    * Return 500 if error occurred
    */
	try {
		if (await CHECK_USER_EXISTS(req.body.email)) {
			return res.status(409).json({
				message: 'Email already exits in database.'
			});
		} else {
			const hash = await HASH_USER_PASSWORD(req.body);
			const user = CREATE_USER_OBJECT(req.body, hash);
			await SAVE_USER(user);

			return res.status(201).json({
				message: 'Handling sign-up request',
				createdUser: user._id,
				requests: [
					{
						type: 'GET',
						url: `localhost:3000/users/${user._id}`,
						verificationRequired: false
					},
					{
						type: 'PATCH',
						url: `localhost:3000/users/${user._id}`,
						verificationRequired: true
					},
					{
						type: 'DELETE',
						url: `localhost:3000/users/${user._id}`,
						verificationRequired: true
					},
					{ type: 'POST', url: `localhost:3000/login`, verificationRequired: false }
				]
			});
		}
	} catch (err) {
		next(err);
	}
};

const CHECK_USER_EXISTS = async (email) => {
	const user = await User.find({ email: email }).exec();
	return user.length >= 1;
};

const HASH_USER_PASSWORD = async ({ password }) => {
	return await bcrypt.hash(password, 10);
};

const CREATE_USER_OBJECT = ({ email }, hash) => {
	return new User({
		_id: new mongoose.Types.ObjectId(),
		email: email,
		passwordHash: hash
	});
};

const SAVE_USER = async (user) => {
	await user.save();
};

module.exports.SIGNUP_ROUTINE = SIGNUP_ROUTINE;
