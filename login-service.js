const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const loginRoute = require('./api/routes/loginRoutes');
const signupRoute = require('./api/routes/signupRoutes');
const userRoutes = require('./api/routes/userRoutes');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
