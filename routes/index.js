var express = require('express');
var app = express()
var passport = require('passport');
var Account = require('../models/account');
var CoinFlip = require('../models/coinFlip');
var router = express.Router();

var server = require('http').Server(app);
var io = require('socket.io')(server);


function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}


router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});


router.post('/register', function(req, res, next) {
    Account.register(new Account({ 
                                name: req.body.name,
                                lastname: req.body.lastname,
                                age: req.body.age,
                                country: req.body.country,
                                city: req.body.city,
                                phonenumber: req.body.phone,
                                city: req.body.city,
                                img: '/img/default.png',
                                username : req.body.username }), 
                                            req.body.password, function(err, account) {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});


router.get('/login', function(req, res) {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


router.get('/room/:id',loggedIn,function(req,res){
    res.locals.path = req.path
    CoinFlip.find({'roomId': req.path.substring(6)}, function(err, coinflip) {
        if(coinflip.length === 0){
            console.log('errrr')
            res.render('404');
        }else{

                creatorUser = coinflip[0].user1;
                creatorBet = coinflip[0].bet;
                creatorImg = coinflip[0].user1Img;
                full = coinflip[0].full;
                res.render('room',{full:full,creatorUser: creatorUser,creatorImg: creatorImg,user:req.user})
        }
    })
})

router.get('/coinflip',loggedIn,function(req, res){
    var coinFlipRooms = {};
    var website = req.protocol + '://' + req.get('host')
    var room = req.protocol + '://' + req.get('host') + '/room/'
    CoinFlip.find({}, function(err, coinflip) {
        coinflip.forEach(function(user) {
            coinFlipRooms[coinflip._id] = coinflip;
        });
    res.render('coinflip',{roomUrls: room, rooms: coinFlipRooms.undefined,user: req.user})
    });
})

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
