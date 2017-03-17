var Item = require('./models/item');

module.exports.list = function(req, res){
	Item.find().count(function(err, count){
		Item.find()
		.limit(3)
		.sort({name: 1})
		.exec('find', function(err, docs){
			res.render("index", {
				title: "Items",
				page: Math.ceil(count/3),
				items: docs
			});
		});
	});		
}

module.exports.paginate = function(req, res){
	Item.find().count(function(err, count){
		console.log('params: '+req.params);
		console.log('body: '+req.body.page);
		Item.find()
		.skip((req.body.page-1)*3)
		.limit(3)
		.sort({name: 1})
		.exec('find', function(err, docs){
			res.render("index", {
				title: "Items",
				page: Math.ceil(count/3),
				items: docs
			});
		});
	});
}