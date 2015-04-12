var express = require('express');
var router = express.Router();



/* Users listing */
router.post('/', function(req, res, next) {
  	var db = req.db;
	var users = db.get('users');
  	var geolib = require('geolib');

  var position = { latitude: req.body.lat , longitude: req.body.lon};

  // Aggiorniamo la posizione dell'utente
  users.updateById(User._id, { $set : position}, function (err, doc) {
	  if (err) throw err;
  });

  // Ritorniamo gli utenti più vicini
  // Al momento torniamo solo la chiave dell'array,
  // poi torneremo anche le informazioni visibili
  // dall'utente che effettua la richiesta in base
  // alle relazioni
  users.find({}, function (err, docs){
  	var nearest = geolib.findNearest(position, docs, 1, 20);
  	res.json(nearest);
  });

});

/**
 * /api/users/{id}
 * Recupero le informazioni relative ad un altro utente in 
 * base alla relazione presente fra i due
 * returns { .. }
 */
router.get('/:id', function (req, res, next) {
	var db = req.db;
	var users = db.get('users');
  var moment = require('moment');

  users.find({ _id : req.params.id }, function(err, doc){  

  	if(doc === null) {
  		res.json({ error : "User does not exist"});
  		return;
  	}    

  	// Dati pubblici
  	data = {
		 	_id : doc._id, 
			name : doc.name, 
			surname : doc.surname.charAt(0) + ".", 
			gender : doc.gender,
			relationship : null 
		};

	// Relazione accettata, aggiungiamo informazioni
    if(User.relationships[req.params.id] === 'accepted') {
    	data.surname = doc.surname;
    	data.image = doc.image;
    	data.relationship = "accepted";
    	data.age = moment().diff(doc.birthdate, 'years');
	} 

	res.json(data);
	
  });

});


/*
 * /api/users/{id}/add
 * Invio una richiesta di contatto a un utente
 * @return { relationship : status }
 *
 */
router.get('/:id/add', function (req, res, next) {
	var db = req.db;
	var users = db.get('users');
	if( typeof User.relationships[req.params.id] === 'undefined') {
		users.updateById(User._id, { $set : {relationships : { 'ciao' : 'requested' }}}, function (err, doc) {
			  if (err) throw err;
		});
	} else {
		res.json({ relationship : User.relationships[req.params.id]});
	}
});

module.exports = router;



