var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource!');
  /*
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e,docs){
        console.log(docs);
    });
  */
});

module.exports = router;



