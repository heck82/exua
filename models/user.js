var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    active: Boolean,
    name: String,
    email: String,
    password: String,
    createDate: Date,
    uptoDate: Date
});

module.exports = mongoose.model('Users', userSchema);