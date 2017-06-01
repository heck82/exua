var express = require('express');
var methodOverride = require('method-override');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

//								DB SETUPS

mongoose.connect('mongodb://heck82:hehe7256@ds161410.mlab.com:61410/myshare');
// mongoose.connect('mongodb://localhost/exua');
var db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('connected', function(err) {
    console.log("Connected to the DataBase");
});

//								MODELS (changes....) ...and so on

var Item = require('./models/item');
var User = require('./models/user');
var Tag = require('./models/tag');

var itemCtrl = require('./controler');

//								VIEW ENGINE

app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.set('views', __dirname + "/views/pages");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use(express.static(__dirname + "/public"));

//								VIEW LIST

app.get("/list", itemCtrl.list);

//								VIEW TAG PAGE

app.get("/tags/:tag", itemCtrl.tagList);

//								VIEW SINGLE ITEM

app.get('/singup', function(req, res) {
    res.render('singup');
});

app.get('/item/view/:id', itemCtrl.viewItem);

//								ADD ITEM

app.get('/item/add', function(req, res) {
    res.render('addForm');
});
app.post('/item/add', itemCtrl.addItem);

//								EDIT ITEM

app.post('/item/edit/:id', function(req, res) {
    Item.findById(req.params.id, function(err, doc) {
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

app.listen(port, function() {
    console.log("Server is running on port: " + port);
});