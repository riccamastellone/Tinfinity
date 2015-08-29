var express = require('express');
var router = express.Router();
var app = express();
var io = require('socket.io').listen(app.listen());

// Demo data
//{ "_id" : ObjectId("55e17cbc20942266594abdc9"), "user1" : "5530d2eb218629bd9fac825a", "user2" : "5530d2ec218629bd9fac825b", "data" : { "user1" : [ { "_id" : "55e17cbc20942266594abdc8", "message" : "ciao 1!", "timestamp" : 1440840892363 }, { "_id" : "55e17cc420942266594abdcb", "message" : "ciao3!", "timestamp" : 1440840900956 }, { "_id" : "55e1b7741c9dfa936dc29f8b", "message" : "still me", "timestamp" : 1440855924898 } ], "user2" : [ { "_id" : "55e17cc120942266594abdca", "message" : "ciao2!", "timestamp" : 1440840897366 }, { "_id" : "55e1b7831c9dfa936dc29f8c", "message" : "now i'm 2", "timestamp" : 1440855939812 } ] } }

/**
 * /api/chat
 * Recupero l'elenco delle conversazioni dell'utente loggato
 * returns { .. }
 */
router.get('/', function (req, res, next) {
  var db = req.db;
  var chat = db.get('chat');

  // Non abbiamo la certezza di chi sia utente1 e utente2,
  // quindi cerchiamo entrambe le combinazioni
  chat.col.aggregate([
    { $match: {
      $or:[
        {'user1': User._id.toString() },
        {'user2': User._id.toString() }
      ]
    }},
    { $unwind: '$data.user1' },
    { $unwind: '$data.user2' },

    { "$group": {
        _id: { _id: "$_id", user1: "$user1", user2: "$user2" },
        user1: { $addToSet:  "$data.user1" },
        user2: { $addToSet:  "$data.user2" }
    }}
  ],function(err,doc){
      res.json(doc)
    }
  );
});

/**
 * /api/chat/{id}
 * Recupero l'intero storico di una conversazione 
 * con l'utente {id}
 * returns { .. }
 */
router.get('/:id', function (req, res, next) {
  var db = req.db;
  var chat = db.get('chat');


  // Non abbiamo la certezza di chi sia utente1 e utente2,
  // quindi cerchiamo entrambe le combinazioni

  chat.col.aggregate([
    { $match: {
      "user1": {$in: [User._id.toString(),req.params.id]},
      "user2": {$in: [User._id.toString(),req.params.id]}
    }},
    { $unwind: '$data.user1' },
    { $unwind: '$data.user2' },
    { "$group": {
        _id: { _id: "$_id", user1: "$user1", user2: "$user2" },
        user1: { $addToSet:  "$data.user1" },
        user2: { $addToSet:  "$data.user2" }
    }}
  ],function(err,doc){
    res.json(doc)
  }
  );

});



/**
 * /api/chat/{id}/{timestamp}
 * Recupero lo storico di una conversazione a partire
 * da un determinato timestamp {timestamp }con l'utente {id}
 * returns { .. }
 */
 
router.get('/:id/:timestamp', function (req, res, next) {
  var db = req.db;
  var chat = db.get('chat');


  chat.col.aggregate([
    { $match: {
      "user1": {$in: [User._id.toString(),req.params.id]},
      "user2": {$in: [User._id.toString(),req.params.id]}
    }},
    { $unwind: '$data.user1' },
    { $unwind: '$data.user2' },
    { $match: {
        "data.user1.timestamp": { $gte: parseInt(req.params.timestamp) }
      }
    },
    { $match: {
        "data.user2.timestamp": { $gte: parseInt(req.params.timestamp) }
      }
    },

    { "$group": {
        _id: { _id: "$_id", user1: "$user1", user2: "$user2" },
        user1: { $addToSet:  "$data.user1" },
        user2: { $addToSet:  "$data.user2" }
    }}
  ],function(err,doc){
    res.json(doc)
  }
  );

});


module.exports = router;



