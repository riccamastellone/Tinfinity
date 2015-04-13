var custom = require('../modules/custom');
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
  	nearest.forEach(function(entry){
        res.json({ 
        	user : custom.filterUser(docs[entry.key]), 
        	distance : entry.distance,
        	position : {
        		latitude : entry.latitude,
        		longitude : entry.longitude
        	}
        });
    }); 
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
  
  users.findOne({ _id : req.params.id }, function(err, doc){  
  	res.json(custom.filterUser(doc));
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

  if(User.hasOwnProperty('relationships') === false) {
    users.updateById(User._id, { $set : {relationships : {}}}, function (err, doc) {
        if (err) throw err;
    });
  }

  if(typeof User.relationships[req.params.id] === 'undefined') {
    relationship = {}
    relationship[req.params.id] = 'requested';
    console.log(relationship);
		users.updateById(User._id, { $set : {relationships : relationship}}, function (err, doc) {
			  if (err) throw err;
        res.json({ relationship : 'requested'});
		});
	} else {
		res.json({ relationship : User.relationships[req.params.id]});
	}
});

module.exports = router;



