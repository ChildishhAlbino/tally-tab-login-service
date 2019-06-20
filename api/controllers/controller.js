const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SIGNUP_ROUTINE = async (req, res, next) => {
	/* 
    Check if user exists in database already, return 409 if true.
    If false, hash their password.
    Store the user
    Return 200 if all worked
    Return 500 if error occurred
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

const GET_ALL_USERS_ROUTINE = async (req, res, next) => {
	/* Retrieves all users from the database and returns them in an array nested inside a JSON Object3
	--------------------------------------------------------------
	Returns 200 if everything worked successfully.
	Returns 500 if an error occurred during the process.
	*/
	try {
		const docs = await GET_ALL_USERS();
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
	} catch (err) {
		next(err);
	}
};

const GET_ALL_USERS = async () => {
	const docs = await User.find().select('_id email passwordHash').exec();
	return docs;
};

module.exports.GET_ALL_USERS_ROUTINE = GET_ALL_USERS_ROUTINE;

const GET_USER_BY_ID_ROUTINE = async (req, res, next) => {
	/*
		When provided a userID, searches the database for a matching item;
		Returns the user data if valid ID, 200 status code. 
		Returns 404 if no user data found.
		Returns 500 if error occurred.
	*/
	try {
		const user = await GET_USER_BY_ID(req.params.userID);
		if (user) {
			res.status(200).json({
				message: 'Handling GET request for specific user',
				userInfo: user
			});
		} else {
			res.status(404).json({
				message: 'No user found with that ID'
			});
		}
	} catch (err) {
		next(err);
	}
};

const GET_USER_BY_ID = async (userID) => {
	const user = await User.findById(userID).select('_id email passwordHash').exec();
	return user;
};

module.exports.GET_USER_BY_ID_ROUTINE = GET_USER_BY_ID_ROUTINE;

const PATCH_USER_DETAILS_ROUTINE = async (req, res, next) => {
	/* 
		Takes a set of patches and a userID and patches the given user's information
		Returns 200 if all worked.
		Returns 404 if no user was found.
		Returns 500 if error occurred.
		Returns 403 if user attempts to change password hash directly.
	*/
	/* 
		Check if user is attempting to patch password. Hash it then patch.
		Check if user is attempting to patch email, check their new one isn't already in use.
	*/
	try {
		const user = await GET_USER_BY_ID(req.params.userID);
		if (user) {
			const patches = req.body.patches;
			if (patches.passwordHash) {
				res.status(403).json({
					message: 'Users cannot update passwordHash field directly.'
				});
			}
			if (patches.password) {
				console.log('Hashing password before patch');
				const hash = await HASH_USER_PASSWORD(patches);
				patches.passwordHash = hash;
				delete patches.password;
			}
			const result = await PATCH_USER_DETAILS(req.params, req.body);
			res.status(200).json({
				message: 'Handling PATCH request to change user data.',
				patchedId: user._id,
				attemptedPatches: req.body.patches,
				result: result
			});
		} else {
			res.status(404).json({
				message: 'No user found with that ID.'
			});
		}
	} catch (err) {
		next(err);
	}
};

const PATCH_USER_DETAILS = async ({ userID }, { patches }) => {
	const result = await User.updateOne({ _id: userID }, { $set: patches }).exec();
	return result;
};

module.exports.PATCH_USER_DETAILS_ROUTINE = PATCH_USER_DETAILS_ROUTINE;
