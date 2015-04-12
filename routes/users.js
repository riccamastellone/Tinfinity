var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Yay!');
  /*
  var db = req.db;
  var users = db.get('usercollection');

  collection.find({},{},function(e,docs){
        console.log(docs);
    });
  */
});

module.exports = router;



