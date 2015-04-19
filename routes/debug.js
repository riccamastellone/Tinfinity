var express = require('express');
var router = express.Router();

var mongoWrapper = require('../custom_modules/mongo_wrapper_module.js')
var messageSample = require('../database/models/message_sample.js');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/find', function(req, res) {
  mongoWrapper.find(messageSample, function(value){ res.json(value) } )
});

router.get('/create', function(req, res) {
  mongoWrapper.create(messageSample, "ciao come va3?", function(value){ res.json(value) } )
});

module.exports = router;
