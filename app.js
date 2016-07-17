// dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var CoinFlip = require('./models/coinFlip');



var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/elotty');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// SOCKET IO


io.on('connection', function(socket){
    socket.on('active games', function(data){
        CoinFlip.create({ 
            user1: data.user,
            bet: data.bet,
            user1Img: data.userImg,
            user1CoinSide:data.coinSide }, function (err, small) {
                if (err) return handleError(err);
                CoinFlip.find({}, function(err, coinflip) {
                    var coinFlipRooms = {};

                coinflip.forEach(function(user) {
                    coinFlipRooms[coinflip._id] = coinflip;
                });
                io.emit('active games', coinFlipRooms);
            });
        })            
    });
    socket.on('user left room',function(data){
        console.log(data)
        CoinFlip.find({roomId: data.room},function(err, room){
            if(room[0].user1 == data.user){
                CoinFlip.find({'roomId': data.room }).remove().exec()
            }
        })
    })
    socket.on('room', function(room) {
        // console.log(io.sockets)
        socket.join(room.roomId);
        var clientsInRoom = io.sockets.adapter.rooms[room.roomId].length
        var creatorUser,creatorBet,creatorImg;
        CoinFlip.find({'roomId': room.roomId}, function(err, coinflip) {
                creatorUser = coinflip[0].user1;
                creatorBet = coinflip[0].bet;
                creatorImg = coinflip[0].user1Img;
                if(clientsInRoom == 1){
                    io.sockets.in(room.roomId).emit('room join', {
                                                            side: 'left-side',
                                                            float: 'left',
                                                            newUser: room.userName,
                                                            newUserImg: room.userImg});
                }else
                if(clientsInRoom == 2){
                    var newUserName = room.userName
                    CoinFlip.findOne({'roomId' : room.roomId},function(err, room){
                        room.user2 = newUserName;
                        room.full = true;
                        room.save();
                    })
                    io.emit('available room',room.roomId)
                    io.sockets.in(room.roomId).emit('new user', {
                                                            creatorUser: creatorUser,
                                                            creatorImg: creatorImg,
                                                            side: 'right-side',
                                                            float: 'right',
                                                            newUser: room.userName,
                                                            newUserImg: room.userImg});
                }
            });
    });
})
// SOCKET IO FINISH





// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
