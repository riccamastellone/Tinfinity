var express = require('express');
var router = express.Router();


router.get('/user1', function(req, res) {
  res.render('chat', {'user1' : '5530d2eb218629bd9fac825a', 'user2' : '5530d2ec218629bd9fac825b', 'token' : 'thisisatoken'});
});
router.get('/user2', function(req, res) {
  res.render('chat', {'user2' : '5530d2eb218629bd9fac825a', 'user1' : '5530d2ec218629bd9fac825b', 'token' : 'thisisanothertoken'});
});

module.exports = router;
