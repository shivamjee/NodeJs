const express = require("express");
const bodyParser = require("body-parser");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req,res,next)=>{
	res.statusCode =200;
	res.setHeader('Content-Type','text/plain');
	next(); //matlab agar /dishes aaya toh res ka ye sab set karke it will
			//pass it to the next pp.use() whcih has /dishes 
})

.get((req,res,next)=>{
	res.end("Will send all the dishes soon");
})

.post((req,res,next)=>{
	res.end("will add the dish "+req.body.name+" with details "+req.body.description);
})

.put((req,res,next)=>{
	res.statusCode = 403
	res.end("PUT not supported");
})

.delete((req,res,next)=>{
	res.end("Deleting all the dishes soon");
});







dishRouter.route('/:dishId')
.all((req,res,next)=>{
	res.statusCode =200;
	res.setHeader('Content-Type','text/plain');
	next(); //matlab agar /dishes aaya toh res ka ye sab set karke it will
			//pass it to the next pp.use() whcih has /dishes 
})
.get((req,res,next)=>{
	res.end("Will send the details of the dish "+req.params.dishId+" to you!");
})

.post((req,res,next)=>{
	res.statusCode = 403
	res.end("POST not supported");
})

.put((req,res,next)=>{
	res.write("updating the dish: "+req.params.dishId);
	res.end("will update dish: "+req.params.dishId+" with the dish "+req.body.name+" and details "+req.body.description);
})

.delete((req,res,next)=>{
	res.end("Deleting dish "+req.params.dishId);
});

module.exports = dishRouter;