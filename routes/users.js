var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
const mongoose = require("mongoose");
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    (err,user)=>{
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err:err});
      }
      else {
        passport.authenticate('local')(req,res,()=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success:true,status: 'Registration Successful!'});          
        });
      }
  });
});



//passport.authenticate('local') checks for user id pass and if it is successful,
// then the fucntions after it will be executed and user field is added to req body
router.post('/login', passport.authenticate('local'),(req, res, next) => {

    var token = authenticate.getToken({_id:req.user._id});

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    //token added to response
    res.json({success:true,token: token,status: 'You have successfully logged in'});
});




router.get('/logout', (req,res) => {
  if (req.session) {
  	//console.log("hi");

    //session is destroyed and removed from server(matlab server folder se nikal jaega)
    req.session.destroy();

    res.clearCookie("session-id");//, {"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"});
    //req.logout()
    //redirect to main page
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
