var express = require('express');
var router = express.Router();


router.get('/user1', function(req, res) {
  res.render('chat', {'user1' : '553e7109ebf3aab9cf54e7ae', 'user2' : '554f6eebebf3aab9cf54e7af', 'token' : 'e0089a353a2233a98531afacdba54b0460ce6b8f606b69bac333991bacc50937'});
});
router.get('/user2', function(req, res) {
  res.render('chat', {'user2' : '553e7109ebf3aab9cf54e7ae', 'user1' : '554f6eebebf3aab9cf54e7af', 'token' : '6a211b78e2c37f74091d7ce19c1cb89bb90c2ea45b6e29782201eeea6825a4f2'});
});

module.exports = router;
