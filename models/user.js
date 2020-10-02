const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema
(

	{
		firstName:{
			type: String,
			default: ''
		},
		lastName:{
			type: String,
			default: ''
		},
		facebookId: String,

		admin:{
			type: Boolean,
			default: false
		}
	}
);

//automatically adds userId and password
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user',userSchema,'users');