const http = require('http');
const service = require('./login-service');

const port = process.env.PORT || 3000;
const server = http.createServer(service);
server.listen(port);
