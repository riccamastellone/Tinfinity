var express = require('express');
var router = express.Router();

var geolib = require('geolib');

/* GET users listing. */
router.post('/', function(req, res, next) {
  
  var db = req.db;
  var users = db.get('users');

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

module.exports = router;



