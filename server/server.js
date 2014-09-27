var http = require('http'),
	mongoose = require('mongoose'),
	config = require('./config/config'),
	chat = require('./controllers/chat.controller')
	;

var main = function(app) {
	var port = process.env.PORT || 5000;
	
	mongoose.connect(config.connectionString);
	
	
	var server = http.createServer(app);
	server.listen(port);
	console.log('http server listening on port: ' + port);
	chat(server);
	//chat.installHandlers(server, {prefix: config.routes.prefix});

	//server.listen(port, '0.0.0.0');
};

module.exports = main;