var sock = require('sockjs'),
	ws = require('ws').Server,
	messages = require('./message.controller'),
	user = require('./user.controller')
	;

/*var clients = {};

function broadcast(message){
  // iterate through each client in clients object
  for (var client in clients){
    // send the message to that client
    clients[client].write(JSON.stringify(message));
  }
} */

function saveMessage(message) {
	if (message.username && message.content) {
		messages.insert(message.username, message.content);
	}
};

var chatter = function(server) {

	var chat = new ws({'server': server});
	
	chat.broadcast = function (data) {
		for (var i in this.clients)
			this.clients[i].send(JSON.stringify(data));
	};
	//var chat = sock.createServer();

	chat.on('connection', function(conn) {

		conn.on('message', function(message) {
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
							conn.send(JSON.stringify(prep));
						}
					});
				}

				if (message['method'] === 'onLogin') {
					messages.findAll(function(mess) {
						conn.send(JSON.stringify(mess));
					});
				}
			}
			else {
				message['time'] = Date.now;
				console.log(message);
				chat.broadcast(message);
				saveMessage(message);
			}
		});

		conn.on('close', function() {
			
		});
	});
}
module.exports = chatter;