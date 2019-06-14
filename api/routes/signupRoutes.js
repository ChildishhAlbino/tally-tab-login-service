const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const controller = require('../controllers/controller');

router.post('/', controller.SIGNUP_ROUTINE);

module.exports = router;
