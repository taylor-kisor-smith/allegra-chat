'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var messageSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	time: {
		type: Date,
		default: Date.now
	}
});

var Message = mongoose.model('Message', messageSchema);

var messageController = {

	insert: function(un, cont) {
		var message = new Message({username: un, content: cont});
		console.log("making a message");
		message.save(function (err) {
			if (err) return console.error(err);
		});
	},

	findAll: function(callback) {
		Message.find({})
			.sort({'time' : 1})
			.exec(function (err, mess) {
				if (err) return console.error(err);
				callback(mess);
			});
	}
};

module.exports = messageController;