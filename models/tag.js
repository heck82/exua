var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
	available: Boolean,
	public: Boolean,
	name: {
		type: String,
		unique: true
	},
	items: [String]
});

module.exports = mongoose.model('Tags', tagSchema);