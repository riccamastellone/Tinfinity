var custom = require('../custom_modules/custom');
var express = require('express');
var router = express.Router();

// Necessario affinche le query funzionino:
// db.users.ensureIndex({position:"2dsphere"});

/**
 * /api/users/me
 * Recupero le informazioni relative a me stesso
 * returns { .. }
 */
router.get('/me', function (req, res, next) {
  var db = req.db;
  var users = db.get('users');

  users.findOne({ _id : User._id }, function(err, doc){
    res.json(doc);
  });
});


/**
 * /api/users/me/images
 * Sincronizza le immagini dell'utente app->server
 * returns { .. } Uguale a /me
 */
router.post('/me/images', function (req, res, next) {
  var db = req.db;
  var users = db.get('users');

  // Aggiorniamo la posizione dell'utente
  users.updateById(User._id, { $set : { images : req.body.images } }, function (err, doc) {
    if (err) throw err
    // Non viene ritornato alcun elemento nella callback, quindi
    // eseguiamo una nuova query per ritornare l'utente
    users.findOne({ _id : User._id }, function(err, doc){
      res.json(doc);
    });
  });
});

/**
 * /api/users
 * Recupero la lista degli utenti piu vicini a me
 * returns { .. }
 */
router.post('/', function(req, res, next) {
  var db = req.db;
	var users = db.get('users');
  var geolib = require('geolib');

  var position = { latitude: parseFloat(req.body.lat) , longitude: parseFloat(req.body.lon) };

  // Aggiorniamo la posizione dell'utente
  users.updateById(User._id, { $set : { position : position } }, function (err, doc) {
	  if (err) throw err
  });

  // Ritorniamo gli utenti più vicini
  users.find({ 
    $and: [ 
      // We have to filter out users with no coordinates
      { position: { $exists: true } }, 
      { position: {
          $nearSphere: {
            $geometry: {
              type: "User" ,
              coordinates: [ position.latitude, position.longitude ]
            },
            $maxDistance: 1000
          }
        }
      } 
    ] 
  }, function (err, docs){
    if(err) throw err

    // No users?
    if(docs === undefined || docs.length == 0) {
      res.json([]);
    } else {
      var data = [];
      docs.forEach(function(entry){
        // We don't need to return ourselves
        if(entry._id != User._id.toString()) {
          data.push({
            user: custom.filterUser(entry),
            position : entry.position
          }); 
        }
      });
      res.json(data);
    }
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
        // Bisogna usare la promise, altrimenti non fa in tempo ad aggiungere
        // il campo che il codice dopo prova ad accederci
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
