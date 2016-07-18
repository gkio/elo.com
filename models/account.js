var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    balance: {
    	type: String,
    	default: '0.00'
    },
   	name: String,
   	lastname: String,
   	country: String,
    img: String,
   	city: String,
   	age: Number,
   	emai: String,
   	phonenumber: Number,
   	verified: {
   		type: Boolean,
   		default: false
   	},
    role:{
      type: String,
      default: 'user'
    }
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);