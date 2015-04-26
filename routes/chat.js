var express = require('express');
var router = express.Router();
var app = express();
var io = require('socket.io').listen(app.listen());

// Demo data
// db.chat.insert({"user1" : "5530d2eb218629bd9fac825a", "user2" : "5530d2ec218629bd9fac825b", "data" : {"user1" : {"553cede16cfae4e7b96762a0" : ["MEss utente 1","1430056736956"],"553cede16cfae4e7b96762aa" : ["Altro mess utente2","1430056736960"]},"user2" : {"553cede16cfae4e7b96762f0" : ["Ciao questo è un messaggio","1430056736856"],"553cede16cfae4e7b96762fa" : ["Ciao questo è un secndo messaggio","1430056736959"]}}})

/**
 * /api/chat/{id}
 * Recupero lo storico di una conversazione 
 * con l'utente {id}
 * returns { .. }
 */
router.get('/:id', function (req, res, next) {
  var db = req.db;
  var chat = db.get('chat');

  // Non abbiamo la certezza di chi sia utente1 e utente2,
  // quindi cerchiamo entrambe le combinazioni
  chat.findOne({ $or: [ 
  	{'user1': User._id.toString() , 'user2': req.params.id },
  	{'user2': User._id.toString() , 'user1': req.params.id },
  	]}, function(err, doc){
    	res.json(doc);
  });
});
module.exports = router;



