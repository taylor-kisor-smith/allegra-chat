var sock = require('sockjs'),
	messages = require('./message.controller'),
	user = require('./user.controller')
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
				console.log(message);
				user.findByUsername(message.body.username, function(err, result) {
					console.log(err);
					console.log(result);

					if (err) return console.log(err);
					var correct = result.password;
					if (correct === message.body.password) {
						var prep = JSON.parse(JSON.stringify(result));
						delete prep['password'];
						prep['auth'] = true;
						console.log(prep);
						conn.write(JSON.stringify(prep));
					}
				});
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