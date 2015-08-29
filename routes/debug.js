var express = require('express');
var router = express.Router();

// Lets use the chat online!
router.get('/webchat', function(req, res) {
	token = prompt('Give me your token');
	user1 = prompt('Give me your user id');
	user2 = prompt('Give me your friend user id');
  	res.render('chat', {'user1' : user1, 'user2' : user2, 'token' : token});
});

module.exports = router;
