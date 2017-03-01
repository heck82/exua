var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
	available: Boolean,
	public: Boolean,
	own: Boolean,
	name: String,
	category: String,
	tags: [String],
	description: String,
	coverImageUrl: String,
	size: Number,
	createDate: Date,
	uptoDate: Date
});

module.exports = mongoose.model('Items', itemSchema);