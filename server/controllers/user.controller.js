'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

var User = mongoose.model('User', userSchema);

var userController = {
	
	insert: function(username, password) {
		var user = new User({'username': username, 'password': password});
		user.save(function (err) {
			if (err) return console.error(err);
		});
	},

	findByUsername: function(username, callback) {
		console.log(username);
		User.findOne({'username': username.trim()}, callback);
	}
};

module.exports = userController;