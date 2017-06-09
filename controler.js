var Item = require('./models/item');
var Tag = require('./models/tag');
var User = require('./models/user');
module.exports.list = function(req, res) {
    Item.find().count(function(err, count) {
        Item.find()
            .skip((req.query.page - 1) * 3)
            .limit(3)
            .sort({ nameLoCase: 1 })
            .exec(function(err, docs) {
                res.render("index", {
                    title: "Items",
                    page: Math.ceil(count / 3),
                    items: docs
                });
            });
    });
}

module.exports.viewItem = function(req, res) {
    Item.findById(req.params.id, function(err, doc) {
        res.render("item", {
            item: doc
        });
    });
}

module.exports.addItem = function(req, res) {
    console.log("Form submited");
    console.log(req.body);
    var item = new Item({
        category: req.body.category,
        name: req.body.name,
        nameLoCase: req.body.name.toLowerCase(),
        tags: req.body.tagName.split(" "),
        description: req.body.description,
        coverImageUrl: req.body.coverImageUrl,
        createDate: new Date()
    });
    console.log("the item is: " + item);

    item.save(function(err, item) {
        if (err) console.log("loading item error: " + err);
        else console.log("saved to db " + item.name);
    });

    var tags = req.body.tagName.split(" ");
    console.log("array of tags: " + tags);
    tags.forEach(function(tagName) {
        console.log("tad Name is " + tagName);
        Tag.findOne({ name: tagName }, function(err, doc) {
            if (!doc) {
                console.log("DOC was NOT found, and CRATED NEW");
                var tag = new Tag({
                    name: tagName,
                    items: item._id
                });
                tag.save(function(err, tag) {
                    if (err) console.log("SAVING tag ERROR: " + err);
                    else console.log("tag added: " + tag.name);
                });
            } else {
                Tag.findOneAndUpdate({ name: tagName }, {
                    $push: {
                        items: item._id
                    }
                }, function(err, doc) {
                    if (err) console.log(err);
                    console.log("updated " + doc.name);
                });
            };
        });
    });

    res.redirect('/');
}

module.exports.editItem = function(req, res) {
    console.log("PUT method recieved");
    Item.update({ _id: req.params.id }, {
        category: req.body.category,
        name: req.body.name,
        nameLoCase: req.body.name.toLowerCase(),
        tags: req.body.tagName.split(" "),
        description: req.body.description,
        coverImageUrl: req.body.coverImageUrl,
        uptoDate: new Date()
    }, function(err) {
        if (err) console.log(err);
        res.redirect('/item/view/' + req.params.id);
    });
}

module.exports.deleteItem = function(req, res) {
    Item.findByIdAndRemove({ _id: req.params.id }, function(err, item) {
        if (err) console.log(err);
        item.tags.forEach(function(tag) {
            Tag.findOneAndUpdate({ name: tag }, {
                $pull: {
                    items: item.id
                }
            }, function(err, tag) {
                if (err) console.log(err);
                console.log("removed '" + item.name + "' from " + tag.name);
            });
            Tag.findOne({ name: tag }, function(err, doc) {
                if (err) console.log(err);
                console.log("test for " + doc);
                if (doc.items[0] == undefined) {
                    Tag.remove({ name: tag }, function(err) {
                        if (err) console.log(err);
                    });
                }
            })
        });
        console.log("Has been deleted: " + req.params.id);
    });
    res.redirect('/');
}

module.exports.tagList = function(req, res) {
    console.log("page is " + req.query.page);
    Tag.findOne({ name: req.params.tag }, function(err, doc) {
        console.log("tag is " + req.params.tag);
        console.log("tag items is " + doc.items);
        Item.find({ _id: { $in: doc.items } }).count(function(err, count) {
            Item.find({ _id: { $in: doc.items } })
                .skip((req.query.page - 1) * 3)
                .limit(3)
                .sort({ name: 1 })
                .exec(function(err, docs) {
                    res.render("tagList", {
                        tagName: req.params.tag,
                        page: Math.ceil(count / 3),
                        items: docs
                    });
                })
        })
    })
}

module.exports.addUser = function(req, res) {
    console.log("Form submited");
    console.log(req.body);
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        createDate: new Date()
    });

    User.findOne({ email: req.body.email }, function(err, doc) {
        if (!doc) {
            user.save(function(err, user) {
                if (err) console.log("loading item error: " + err);
                else {
                    res.redirect('/');
                    console.log("saved to db " + user.name);
                }
            });
        } else {
            res.send("Email already in use");
        }
    });
    console.log("the user is: " + user);
}