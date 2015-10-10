var express = require('express');
var router = express.Router();


/**
 * POST /api/device/register
 * Registra l'identificativo del device per le notifiche push
 */
router.post('/register', function (req, res, next) {
  var db = req.db;
  var users = db.get('users');
  
  users.updateById(User._id, 
	  { $addToSet: { 'devices' : red.body.deviceToken } }, function(err, doc) {
	    if (err) throw err;
	    res.json('Thank you sir')
	});
  
});

module.exports = router;
