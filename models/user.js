var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    active: Boolean,
    firstName: String,
    email: String,
    pass: String,
    createDate: Date,
    uptoDate: Date
});

module.exports = mongoose.model('Users', userSchema);