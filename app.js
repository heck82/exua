var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/exua');
var db = mongoose.connection;
mongoose.Promise = global.Promise;

//								MODELS (changes....) ...and so on

var Item = require('./models/item');
var User = require('./models/user');
var Tag = require('./models/tag');

//								VIEW ENGINE

app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + "public"));

//								VIEW LIST

app.get("/list", function(req, res){
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
		
});

//								PAGINATION

app.post("/list", function(req, res){
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
				page: count/3+1^0,
				items: docs
			});
		});
	});
});

//								VIEW SINGLE ITEM

app.get('/item/view/:id', function(req, res){
	Item.findById(req.params.id, function(err, doc){
		res.render("item", {
			item: doc
		});
	});
});

//								VIEW TAG PAGE

app.get('/tags/:name', function(req, res){
	Tag.findOne({name: req.params.name}, function(err, tag){
		console.log(req.params.name);
		console.log(tag.items);
		res.send(tag.items);
	});
});

//								ADD ITEM

app.get('/item/add', function(req, res){
	res.render('addForm');
});
app.post('/item/add', function(req, res){
	console.log("Form submited");
	console.log(req.body);
	var tag = new Tag({
		name: req.body.tagName,
		items: req.body.name
	});
	var item = new Item({ 
		category: req.body.category,
		name: req.body.name,
		tags: tag.name,
		description: req.body.description,
		coverImageUrl: req.body.coverImageUrl,
		createDate: new Date()
	});
	Tag.findOne({name: req.body.tagName}, function(err, tagObj){
		console.log("the TAG in find: "+tagObj);
		if(tagObj.name == req.body.tagName){
			var itemNew = tagObj.items.push(req.body.name);
			console.log("traversed name: "+tagObj.items);
			Tag.update({_id: tagObj._id}, {
				items: itemNew
			}, function (err) {
				if (err) console.log(err);
			});
		}
	});
	// console.log("the item is: "+item);
	// console.log("tag added: "+tag);

	tag.save(function(err, tag){
		if (err) console.log("loading item error: "+err);
	});
	item.save(function(err, item){
		if (err) console.log("loading item error: "+err);
	});
	
	res.redirect('/list');
});

//								EDIT ITEM

app.post('/item/edit/:id', function(req, res){
	Item.findById(req.params.id, function(err, doc){
		res.render('editForm', {
			item: doc
		});
	});
});
app.post('/item/:id', function(req, res){
	Item.update({_id: req.params.id}, {
		category: req.body.category,
		name: req.body.name,
		description: req.body.description,
		tags: req.body.tagName,
		coverImageUrl: req.body.coverImageUrl,
		uptoDate: new Date()
	}, function(err){
		if(err) console.log(err);
		res.redirect('/item/view/'+req.params.id);
	});
});

//								DELETE ITEM

app.post('/item/delete/:id', function(req, res){
	console.log(req.params.id);
	Item.remove({_id: req.params.id}, function(err){
		if(err) console.log(err);
	});
	res.redirect('/list');
});

//								PORT LISTENING

app.listen(port, function(){
	console.log("Server is running on port: " +port);
});