var sock = require('sockjs'),
	messages = require('./message.controller')
	;

var clients = {};

function broadcast(message){
  // iterate through each client in clients object
  for (var client in clients){
    // send the message to that client
    clients[client].write(JSON.stringify(message));
  }
}

function saveMessage(message) {
	if (message.username && message.content) {
		messages.insert(message.username, message.content);
	}
};

var chat = sock.createServer();

chat.on('connection', function(conn) {

	clients[conn.id] = conn;
	console.log('connected to: ' + conn.id);

	conn.on('data', function(message) {
		var message = JSON.parse(message);

		if(message.method) {
			if(message['method'] === 'auth') {

			}

			if (message['method'] === 'onLogin') {
				messages.findAll(function(mess) {
					conn.write(JSON.stringify(mess));
				});
			}
		}
		else {
			message['time'] = Date.now;
			console.log(message);
			broadcast(message);
			saveMessage(message);
		}
	});

	conn.on('close', function() {
		delete clients[conn.id];
	});
});
 
module.exports = chat;