const express = require("express");
const bodyParser = require("body-parser");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next)=>{
	res.statusCode =200;
	res.setHeader('Content-Type','text/plain');
	next(); //matlab agar /dishes aaya toh res ka ye sab set karke it will
			//pass it to the next pp.use() whcih has /dishes 
})

.get((req,res,next)=>{
	res.end("Will send all the leader soon");
})

.post((req,res,next)=>{
	res.end("will add the leader "+req.body.name+" with details "+req.body.description);
})

.put((req,res,next)=>{
	res.statusCode = 403
	res.end("PUT not supported");
})

.delete((req,res,next)=>{
	res.end("Deleting all the leader soon");
});







leaderRouter.route('/:leaderId')
.all((req,res,next)=>{
	res.statusCode =200;
	res.setHeader('Content-Type','text/plain');
	next(); //matlab agar /dishes aaya toh res ka ye sab set karke it will
			//pass it to the next pp.use() whcih has /dishes 
})
.get((req,res,next)=>{
	res.end("Will send the details of the leader "+req.params.leaderId+" to you!");
})

.post((req,res,next)=>{
	res.end("will add the leader "+req.body.name+" and details "+req.body.description);
})

.put((req,res,next)=>{
	res.write("updating the leader: "+req.params.leaderId);
	res.end("will update leader: "+req.params.leaderId+" with the dish "+req.body.name+" and details "+req.body.description);
})

.delete((req,res,next)=>{
	res.end("Deleting leader "+req.params.leaderId);
});

module.exports = leaderRouter;