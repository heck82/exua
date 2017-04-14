var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
	available: Boolean,
	public: Boolean,
	name: {
		type: String,
		unique: true
	},
	items: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Items'
	}]
});

module.exports = mongoose.model('Tags', tagSchema);