const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const loginRoute = require('./api/routes/loginRoutes');
const signupRoute = require('./api/routes/signupRoutes');
const userRoutes = require('./api/routes/userRoutes');

const app = express();

mongoose.connect(
	'mongodb+srv://admin:' +
		process.env.MONGO_ADMIN_PASSWORD +
		'@tallytab-yqcjf.mongodb.net/test?retryWrites=true&w=majority',
	{ useNewUrlParser: true }
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	req.header('Access-Control-Allow-Origin', '*');
	req.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

app.use('/login', loginRoute);
app.use('/users', userRoutes);
app.use('/signup', signupRoute);

app.use((req, res, next) => {
	// Invalid routes will be caught by this middleware.
	const error = new Error('Not found');
	error.status = 404;
	// passes it onto the next catch.
	next(error);
});

app.use((error, req, res, next) => {
	// catches all requests that throw an error
	// and passes back a generic explanation
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;
