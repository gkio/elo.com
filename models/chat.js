var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var Chat = new Schema({
    "text" : String,
    "time" : String,
    "img" : String,
    "user": String,
});


module.exports = mongoose.model('chat', Chat);