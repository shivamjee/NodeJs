const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favSchema = new Schema
(
	{
		userId:{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user'
		},
		dishes:[
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Dish'
			}
		]
	},
	{
		timestamps: true
	}
);
var Favorites = mongoose.model('Fav',favSchema);
module.exports = Favorites;