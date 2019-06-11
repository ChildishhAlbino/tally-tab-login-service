const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
	const user = {
		email: req.body.email,
		hash: req.body.hash
	};
	res.status(200).json({
		message: 'Handling sign-up request',
		user: user
	});
});

module.exports = router;
