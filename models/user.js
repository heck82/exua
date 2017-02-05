var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	active: Boolean,
	firstName: String,
	lastName: String,
	age: Number,
	email: String,
	login: String,
	pass: String
});

module.exports = mongoose.model('Users', userSchema);