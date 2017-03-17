var Item = require('./models/item');

module.exports.list = function(req, res){
	Item.find().count(function(err, count){
		Item.find()
		.limit(3)
		.sort({name: 1})
		.exec('find', function(err, docs){
			res.render("index", {
				title: "Items",
				page: count/3+1^0,
				items: docs
			});
		});
	});		
}