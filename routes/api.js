var express = require('express');
var router = express.Router();


var users = require('./users');
router.use('/users', users);

router.post('/ping',function(req, res, next) {
  	/*
  	-> 
	location

	<- 
	ok
	*/
})


module.exports = router;
