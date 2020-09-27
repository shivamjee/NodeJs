var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('./models/user');

//user.authenticate() comes with passport-local-mongoose package only
//so if we dont use it then we have to make our own function like we did with users.js
exports.local = passport.use(new localStrategy(User.authenticate()));


//helps us work with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
