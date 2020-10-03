const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require('../authenticate');

const favDishes = require('../models/fav');

const favRouter = express.Router();
favRouter.use(bodyParser.json());


favRouter.route('/')
.get(authenticate.verifyUser,(req,res,next)=>{
	favDishes.findOne({userId: req.user._id})
	.populate('userId')
	.populate('dishes')
	.then((favItem)=>{
		if(favItem)
		{
			res.statusCode = 200;
			res.setHeader('Content-Type','application/json');
			res.json(favItem);	
		}
		else
		{
			err = new Error('No favorites'); 
			res.statusCode = 404;
			return next(err);
		}
		
	},(err)=> next(err))
	.catch((err)=>next(err));
})

.post(authenticate.verifyUser,(req,res,next)=>{
	favDishes.findOne({userId: req.user._id})
	.then((favItem)=>{
		if(favItem == null)
			favItem = new favDishes({userId: req.user._id});
		for(let i of req.body)
		{
			if(favItem.dishes.indexOf(i.id) != -1)
				continue;
			else
				favItem.dishes.push(i.id);
		}
		favItem.save()
		.then((resp)=>{
			res.statusCode = 200;
			res.setHeader('Content-Type','application/json');
			res.json(resp);
		},(err)=> next(err))
		//.catch((err)=>next(err));
	},(err)=> next(err))
	.catch((err)=>next(err));	
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	favDishes.deleteOne({userId: req.user._id})
	.then((favItem)=>{
		if(favItem)
		{
			res.statusCode = 200;
			res.setHeader('Content-Type','application/json');
			res.json(favItem);	
		}
		else
		{
			err = new Error('No favorites'); 
			res.statusCode = 404;
			return next(err);
		}
	},(err)=> next(err))
	.catch((err)=>next(err));
});




favRouter.route('/:dishId')
.post(authenticate.verifyUser,(req,res,next)=>{
	favDishes.findOne({userId: req.user._id})
	.then((favItem)=>{
		//if item doesnt exist then creat a doc and save in it
		if(favItem == null)
			var favItem = new favDishes({userId: req.user._id});
		if(favItem.dishes.indexOf(req.params.dishId) == -1)
		{
			favItem.dishes.push(req.params.dishId);
			favItem.save()
			.then((resp)=>{
				res.statusCode = 200;
				res.setHeader('Content-Type','application/json');
				res.json(resp);
			},(err)=> next(err))
			//.catch((err)=>next(err));
		}
		else
		{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({status: "ItemAlreadyAdded"});
		}
	},(err)=> next(err))
	.catch((err)=>next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	//find the favItem
	favDishes.findOne({userId: req.user._id})
	.then((favItem)=>{
		// if FavItem is null means fav doesnt exist
		if(favItem != null)
		{
			//find dishId is present in the dishes array
			if( favItem.dishes.indexOf(req.params.dishId) == -1)
			{
				err = new Error('Dish not found'); 
				res.statusCode = 404;
				return next(err);	
			}
			else
			{
				favItem.dishes.remove(req.params.dishId);
				//if length is 0 then remove document poora
				if(favItem.dishes.length == 0)
				{
					favDishes.deleteOne({userId: req.user._id})
					.then((favItem)=>{
						if(favItem)
						{
							res.statusCode = 200;
							res.setHeader('Content-Type','application/json');
							res.json(favItem);	
						}
						else
						{
							err = new Error('No favorites'); 
							res.statusCode = 404;
							return next(err);
						}
					},(err)=> next(err))
					//.catch((err)=>next(err));
				}
				else
				{
					favItem.save()
					.then((resp)=>{
						res.statusCode = 200;
						res.setHeader('Content-Type','application/json');
						res.json(resp);
					},(err)=> next(err))
					//.catch((err)=>next(err));	
				}
				
			}

		}
		else
		{
			err = new Error('No favorites'); 
			res.statusCode = 404;
			return next(err);
		}
	},(err)=> next(err))
	.catch((err)=>next(err));
});

module.exports = favRouter;





