const express = require('express');
const loginRoute = require('./api/routes/loginRoutes');
const signupRoute = require('./api/routes/signupRoutes');
const userRoutes = require('./api/routes/userRoutes');

const app = express();
app.use('/login', loginRoute);
app.use('/users', userRoutes);
app.use('/signup', signupRoute);

module.exports = app;
