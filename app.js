var express = require('express');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

//								DB SETUPS

mongoose.connect('mongodb://localhost/exua');
var db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('connected',function(err){
	console.log("Connected to the DataBase");
});

//								MODELS (changes....) ...and so on

var Item = require('./models/item');
var User = require('./models/user');
var Tag = require('./models/tag');

var itemCtrl = require('./controler');

//								VIEW ENGINE

app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use(express.static(__dirname + "public"));

//								VIEW LIST

app.get("/list", itemCtrl.list);

//								PAGINATION

app.post("/list", itemCtrl.paginate);

//								VIEW SINGLE ITEM

app.get('/item/view/:id', itemCtrl.viewItem);

//								VIEW TAG PAGE

app.get('/tags/:name', function(req, res){
	Tag.findOne({name: req.params.name}, function(err, teg){
		console.log(req.params.name);
		console.log(teg.items);
		res.send(teg.items);
	});
});

//								ADD ITEM

app.get('/item/add', function(req, res){
	res.render('addForm');
});
app.post('/item/add', itemCtrl.addItem);

//								EDIT ITEM

app.post('/item/edit/:id', function(req, res){
	Item.findById(req.params.id, function(err, doc){
		res.render('editForm', {
			item: doc
		});
	});
});

app.put('/item/:id', itemCtrl.editItem);

//								DELETE ITEM

app.delete('/item/delete/:id', itemCtrl.deleteItem);

//								PORT LISTENING

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("Server is running on port: " +port);
});