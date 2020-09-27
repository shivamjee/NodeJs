var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter.js');
var promoRouter = require('./routes/promoRouter.js');
var leaderRouter = require('./routes/leaderRouter.js');


//Connecting to database
var mongoose = require('mongoose');
var Dishes = require('./models/dishes');
var Promos = require('./models/promo');
var Leaders = require('./models/leaders');
const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url, {useNewUrlParser: true });

connect.then((db)=>{
	console.log("\nConnected to db software\n");
})
.catch((err)=>{
	console.log("error");
});



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));  //same as morgan
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/*
app.use(cookieParser('12345-67890-09876-54321'));


auth function using cookies
see another auth function after this made using sessions
function auth(req,res,next)
{
	console.log(req.signedCookies);
	//check if cookies exist or not
	if(!req.signedCookies.user) //not present
	{
		var authHeader = req.headers.authorization;
		if(!authHeader)
		{
			var err = new Error('You are not authenticated');
			res.setHeader('WWW-Authenticate','Basic');
			err.status = 401;
			return next(err);
		}
		//create an array auth with id and password
		//auth header looks like: Basic YWRtaW46cGFzcw==
		//we need YWRtaW46cGFzcw== which is converted to id:password
		var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');

		var username = auth[0];
		var password = auth[1];

		if(username == 'admin' && password == 'pass') //authenticated then
		{
			//set a cookie for future
			res.cookie('user','admin',{signed: true}); //set the user value of cookie to admin
			next();
		}
		else
		{
			var err = new Error('You are not authenticated');
			res.setHeader('WWW-Authenticate','Basic');
			err.status = 401;
			return next(err);
		}
	}
	//if cookies exist
	else
	{
		if(req.signedCookies.user === 'admin')
			next();
		else
		{
			var err = new Error('You are not authenticated');
			res.setHeader('WWW-Authenticate','Basic');
			err.status = 401;
			return next(err);
		}

	}
	
}*/

//adds a session header to the request as will be seen in the auth func
app.use(session({
	name: 'session-id',
	secret: '12345-67890-09876-54321',
	saveUninitialized: false,
  	resave: false,
  	store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());
//should be able to use it even without authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);



function auth(req,res,next)
{
	//check if session exist or not
	if(!req.user){ //not present
		var err = new Error('You are not authenticated');
		res.setHeader('WWW-Authenticate','Basic');
		err.status = 403;
		return next(err);
	}
	//if session exist
	else{
		next();
	}
	
}


app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
