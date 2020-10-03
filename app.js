var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter.js');
var promoRouter = require('./routes/promoRouter.js');
var leaderRouter = require('./routes/leaderRouter.js');
var uploadRouter = require('./routes/uploadRouter.js'); 
var favRouter = require('./routes/favRouter.js'); 


//Connecting to database
var mongoose = require('mongoose');
var Dishes = require('./models/dishes');
var Promos = require('./models/promo');
var Leaders = require('./models/leaders');


const url = config.mongoUrl;
const connect = mongoose.connect(url, {useNewUrlParser: true,useCreateIndex: true });

connect.then((db)=>{
	console.log("\nConnected to db software\n");
})
.catch((err)=>{
	console.log("error");
});



var app = express();

app.all('*',(req,res,next)=>{
	//if request on secure then req will automatically get a secure header with value true
	if(req.secure){
		return next();
	}
	else{
		//secPort defined in wwww in bin
		res.redirect(307,'https://'+req.hostname+':'+app.get('secPort')+req.url);
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));  //same as morgan
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(passport.initialize());
//app.use(passport.session());

//should be able to use it even without authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);


//auth function removed

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favorites',favRouter);

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
