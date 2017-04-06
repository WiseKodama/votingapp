var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');
var app = express();

mongoose.Promise = global.Promise;
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
mongoose.connect(configDB.url,options);
require('./config/passport')(passport);
var conn = mongoose.connection;
conn.on('error',console.error.bind(console,'Connection Error'));
conn.once('open',function(){console.log('Connected to DB');});

var port = process.env.PORT||8080;

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');
app.use(session({secret:'fartymcfartpants',resave:true,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(__dirname));

require('./app/routes.js')(app,passport);

//req.headers['x-forwarded-for'] grab users IP address 

app.listen(port,function(err){
    if(err) return console.error(err);
    console.log('App Running on Port ' + port);
})