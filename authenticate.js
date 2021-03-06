var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var jwtStrategy = require('passport-jwt').Strategy;
var extractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var FacebookTokenStrategy = require('passport-facebook-token');

var config = require('./config');

//user.authenticate() comes with passport-local-mongoose package only
//so if we dont use it then we have to make our own function like we did with users.js
exports.local = passport.use(new localStrategy(User.authenticate()));


//helps us work with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//create a token
exports.getToken = function(user)
{
	//create a token
	return jwt.sign(user,config.secretKey,{expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
	new jwtStrategy(
		opts,
		(jwt_payload,done)=>{
			console.log("JWT payload",jwt_payload);
			User.findOne({_id:jwt_payload._id},(err,user)=>{
				if(err)
				{
					//some error
					return done(err,false);
				}
				else if(user)
				{
					// user found
					return done(null,user);
				}
				else
				{
					// unable to find user
					return done(null,user);
				}
			});
		}
	));

//similar function used in users.js with different startegy
exports.verifyUser = passport.authenticate('jwt',{session:false});

exports.verifyAdmin = function(req,res,next){
	if(req.user.admin == true)
	{
		next();
	}
	else
	{
		var err = new Error("You are not an admin");
		err.status = 401;
		next(err);

	}
}
exports.facebookPassport = passport.use(
	new FacebookTokenStrategy({
			clientID: config.facebook.clientId,
			clientSecret: config.facebook.clientSecret
		},(accessToken,refreshToken,profile,done)=>{
			User.findOne({facebookId: profile.id},(err,user)=>{
				if(err){
					return done(err,false);
				}
				if(!err && user !== null){
					return done(null,user);
				}
				else{
					user = new User({username: profile.displayName});
					user.facebookId = profile.id;
					user.firstName = profile.name.givenName;
					user.lastName = profile.name.familyName;
					user.save((err,user)=>{
						if(err)
							done(err,false);
						else
							done(null,user);
					})
				}
			});
		}
));

