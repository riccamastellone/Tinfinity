var express = require('express');
var router = express.Router();


// Utilizziamo questo Middleware
// per autenticare tutte le richieste
router.use(function (req, res, next) {

	// Header che serve in tutte le richieste
	res.setHeader('Content-Type', 'application/json');

	var db = req.db;
  	var users = db.get('users');

	//db.users.insert({ "name" : "Riccardo", "surname" : "Mastellone", "email" : "riccardo.mastellone@gmail.com", "token" : "thisisatoken" })
	//db.users.insert({ "name" : "Giovanni", "surname" : "Palazzo", "email" : "giovanni.palazzo@gmail.com", "token" : "thisisatoken" , "latitude" : "45.484083899999995", "longitude" : "9.209376899999999"})
  	var token = req.get('X-Api-Token');

  	// Semplifichiamoci la vita e accettiamo il token anche nella POST o nella GET
  	if(token == null) {
  		if(req.method == 'POST') {
  			token = req.body['X-Api-Token'];
  		} else if(req.method == 'GET') {
  			token = req.query['X-Api-Token'];
  		}
  		
  	}
	
	users.findOne({ 'token' : token }, function(err, doc){
		if(doc !== null && err == null) {
			console.log('Authorized user id ' + doc._id + ' with token ' + token);
			User = doc;
			// Ottimo, passiamo alla prossima richiesta
			next();
		} else {
			console.log('Not authorized');
			res.status(403).json({'error' : 'Not authorized'});
		}
	});
  	
});

var users = require('./users');
router.use('/users', users);

var chat = require('./chat');
router.use('/chat', chat);


module.exports = router;
