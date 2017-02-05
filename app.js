var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/exua');
var db = mongoose.connection;
mongoose.Promise = global.Promise;

//								MODELS

var Item = require('./models/item');
var User = require('./models/user');

//								VIEW ENGINE

app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + "public"));

//								VIEW LIST

app.get("/list", function(req, res){

	Item.find(function(err, docs){
		res.render("index", {
			title: "Items",
			items: docs
		});
	}).sort({'name': 1}).skip(0).limit();
});

//								VIEW SINGLE ITEM

app.get('/item/view/:id', function(req, res){
	Item.findById(req.params.id, function(err, doc){
		res.render('item', {
			item: doc
		});
	});
});

//								ADD ITEM

app.get('/item/add', function(req, res){
	res.render('addForm');
});
app.post('/item/add', function(req, res){
	console.log("Form submited");
	console.log(req.body);
	var item = new Item({
		category: req.body.category,
		name: req.body.name,
		description: req.body.description,
		coverImageUrl: req.body.coverImageUrl,
		createDate: new Date()
	});
	console.log("the item is: "+item);
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