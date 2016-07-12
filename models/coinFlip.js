var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var CoinFlip = new Schema({
    "roomId" : { 
      type: String, 
      default: shortid.generate
    },
    "user1" : String,
    "user2" : String,
    "bet" : Number,
    "user1CoinSide" : String,
    "user2CoinSide" : String  
});


module.exports = mongoose.model('coinFlip', CoinFlip);