const express = require('express');
const router = express.Router();
const User = require('../models/user');
const controller = require('../controllers/controller');

router.get('/', controller.GET_ALL_USERS_ROUTINE);

router.get('/:userID', controller.GET_USER_BY_ID_ROUTINE);

router.patch('/:userID', controller.PATCH_USER_DETAILS_ROUTINE);

router.delete('/:userID', controller.DELETE_USER_ROUTINE);

module.exports = router;
