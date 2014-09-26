var http = require('http'),
	mongoose = require('mongoose'),
	config = require('./config/config'),
	chat = require('./controllers/chat.controller')
	;


mongoose.connect(config.connectionString);

var server = http.createServer();
chat.installHandlers(server, {prefix: config.routes.prefix});

server.listen(1337, '0.0.0.0');