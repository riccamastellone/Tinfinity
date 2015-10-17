var custom = require('../custom_modules/custom');
var express = require('express');
var router = express.Router();
var pushbots = require('pushbots');
var Pushbots = new pushbots.api({
    id:'56179eb117795989018b4567',
    secret:'8f833dd534760fe2ee4d404c388b3847'
});

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
 * POST /api/users/me/images
 * Sincronizza le immagini dell'utente app->server
 * returns { .. } Uguale a /me
 */
router.post('/me/images', function (req, res, next) {
  var db = req.db;
  var users = db.get('users');

  var index = parseInt(req.body.image)
  
  if(isNaN(index)) {
    res.json("What are you doing?");
  } else {
    var query = {};
    query['images.' + req.body.image] = req.body.imageData;
    users.updateById(User._id, 
      { $set: query }, function(err, doc) {
        if (err) throw err;
        res.json('Thank you sir')
    });
  }
  
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
  var id = req.params.id;

  users.findOne({ _id : id }, function(err, doc){
    if(err !== null) {
      res.json({ error : "Error retrieving data"});
    } else {
      res.json(custom.filterUser(doc));
    }
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

  // Nel caso non sia definita alcuna relazione con questo utente
  if(typeof User.relationships[req.params.id] === 'undefined') {
    // Inseriamolo nell'utente effettivo
    var query = {};
    query['relationships.' + req.params.id] = 'requested';
    users.updateById(User._id, { $set : query }, function (err, doc) {
        if (err) throw err;
        res.json({ relationship : 'requested'});
    });

    // Recuperiamo l'utente richiesto
    users.findOne({ _id : req.params.id }, function(err, doc){
      if(err) throw err;
        // Inseriamo la relazione nell'utente richiesto
        var query = {};
        query['relationships.' + User._id.toString()] = 'received';
        users.updateById(doc._id, { $set : query }, function (err, doc) {
            if (err) throw err;
        });

    });

    // Notifica
    Pushbots.setMessage(User.name + ' sent you a request', '0');
    Pushbots.sendByAlias(req.params.id);
    Pushbots.push(function(response){});

    


  } else {
    // Relazione già presente, torniamola
    res.json({ relationship : User.relationships[req.params.id]});
  }
});


/*
 * /api/users/{id}/accept
 * Accettiamo una richiesta di amicizia dall'utente id
 * @return { relationship : status }
 *
 */
router.get('/:id/accept', function (req, res, next) {
  var db = req.db;
  var users = db.get('users');


  if(typeof User.relationships[req.params.id] !== 'undefined' && User.relationships[req.params.id] == 'received') {
    var query = {};
    query['relationships.' + req.params.id] = 'accepted';
    users.updateById(User._id, { $set : query }, function (err, doc) {
        if (err) throw err;
        res.json({ relationship : 'accepted'});
    });

    // Recuperiamo l'utente richiesto
    users.findOne({ _id : req.params.id }, function(err, doc){
      if(err) throw err;
        // Inseriamo la relazione nell'utente richiesto
        var query = {};
        query['relationships.' + User._id.toString()] = 'accepted';
        users.updateById(doc._id, { $set : query}, function (err, doc) {
            if (err) throw err;
        });
    });

    Pushbots.setMessage(User.name + ' accepted your request!', '0');
    Pushbots.sendByAlias(req.params.id);
    Pushbots.push(function(response){});

  } else {
    res.json('What are you trying to do?');
  }
});


/*
 * /api/users/{id}/decline
 * Rifiutiamo una richiesta di amicizia dall'utente id
 * Questo non fa altro che eliminare il record: non c'è alcun limite
 * che impedisca agli utenti di inviare una nuova richiesta
 * @return { relationship : status }
 *
 */
router.get('/:id/decline', function (req, res, next) {
  var db = req.db;
  var users = db.get('users');


  if(typeof User.relationships[req.params.id] !== 'undefined' && User.relationships[req.params.id] == 'received') {
    var query = {};
    query['relationships.' + req.params.id] = '';
    users.updateById(User._id, { $unset : query }, function (err, doc) {
        if (err) throw err;
        res.json({ relationship : ''});
    });

    // Recuperiamo l'utente richiesto
    users.findOne({ _id : req.params.id }, function(err, doc){
      if(err) throw err;
        // Inseriamo la relazione nell'utente richiesto
        var query = {};
        query['relationships.' + User._id.toString()] = '';
        users.updateById(doc._id, { $unset : query}, function (err, doc) {
            if (err) throw err;
        });
    });

    // Inviamo notifica push all'utente
    Pushbots.setMessage(User.name + ' declined your request', '0');
    Pushbots.sendByAlias(req.params.id);
    Pushbots.push(function(response){});

  } else {
    res.json('What are you trying to do?');
  }
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



module.exports = router;
