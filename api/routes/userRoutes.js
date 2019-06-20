const express = require('express');
const router = express.Router();
const User = require('../models/user');
const controller = require('../controllers/controller');

router.get('/', controller.GET_ALL_USERS_ROUTINE);

router.get('/:userID', controller.GET_USER_BY_ID_ROUTINE);

router.patch('/:userID', controller.PATCH_USER_DETAILS_ROUTINE);

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
