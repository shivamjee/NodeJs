const express = require("express");
const bodyParser = require("body-parser");

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next)=>{
	res.statusCode =200;
	res.setHeader('Content-Type','text/plain');
	next(); //matlab agar /dishes aaya toh res ka ye sab set karke it will
			//pass it to the next pp.use() whcih has /dishes 
})

.get((req,res,next)=>{
	res.end("Will send all the promo soon");
})

.post((req,res,next)=>{
	res.end("will add the promo "+req.body.name+" with details "+req.body.description);
})

.put((req,res,next)=>{
	res.statusCode = 403
	res.end("PUT not supported");
})

.delete((req,res,next)=>{
	res.end("Deleting all the promo soon");
});







promoRouter.route('/:promoId')
.all((req,res,next)=>{
	res.statusCode =200;
	res.setHeader('Content-Type','text/plain');
	next(); //matlab agar /dishes aaya toh res ka ye sab set karke it will
			//pass it to the next pp.use() whcih has /dishes 
})
.get((req,res,next)=>{
	res.end("Will send the details of the promo "+req.params.promoId+" to you!");
})

.post((req,res,next)=>{
	res.end("will add the promo "+req.body.name+" and details "+req.body.description);
})

.put((req,res,next)=>{
	res.statusCode = 403
	res.end("PUT not supported");
})

.delete((req,res,next)=>{
	res.end("Deleting promo "+req.params.promoId);
});

module.exports = promoRouter;