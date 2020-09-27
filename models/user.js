const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema
(
	{
		admin:{
			type: Boolean,
			default: false
		}
	}
);

//automatically adds userId and password
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user',userSchema,'users');