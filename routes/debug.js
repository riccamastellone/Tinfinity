var express = require('express');
var router = express.Router();

//CAPIRE DOVE METTERLE PER FARE UNA COSA FATTA BENE
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/tinfinity');
var messageSample = db.get('messagesample')

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/find', function(req, res) {

  messageSample.find({}, function (err, results) {
                if (err) return next(err);
                res.json(results)
    } )

});

router.get('/create', function(req, res) {
  //mongoWrapper.create(messageSample, "ciao come va3?", function(value){ res.json(value) } )
  messageSample.insert({ message : "ciao come va?"}, function (err, results) {
                if (err) return next(err);
                res.json(results)
    } )
});

module.exports = router;
