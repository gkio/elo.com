var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var CoinFlip = new Schema({
    "roomId" : { 
      type: String, 
      default: shortid.generate
    },
    "user1" : String,
    "user1Img" : String,
    "user2" : {
    	type: String,
    	default: 'enemy not found'
    },
    "full": {
    	type: Boolean,
    	default: false
    },
    "user2Img" : String,
    "bet" : Number,
    "user1CoinSide" : String,
    "user2CoinSide" : String  
});


module.exports = mongoose.model('coinFlip', CoinFlip);