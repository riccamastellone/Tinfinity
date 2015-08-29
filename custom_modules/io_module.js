/**
*  Chat real-time basata sui Web Sockets e supportata dalla libreria Socket.io
**/

module.exports = function (io) {

  // Recupero l'istanza del DB
  var mongo = require('mongodb');
  var monk = require('monk');
  var db = monk('localhost:27017/tinfinity');
  var users = db.get('users');
  var chat = db.get('chat');

    io.on('connection', function(socket){
      console.log('User connetect via Socket.io');

      // Messaggio inviato da un client
      socket.on('message', function(data){

        // 1. Validazione Token
        users.findOne({ 'token' : data.token }, function(err, doc){
          if(doc !== null && err == null) {
            User = doc;

            var timestamp = Date.now();
            
            // 1.1 Validazione autorizzazioni a comunicare con l'utente 
            //     richiesto
            // @TODO

            // 2. Salvataggio a DB
            chat.findOne({ $or: [ 
              {'user1': data.user1 , 'user2': data.user2 },
              {'user2': data.user1 , 'user1': data.user2 },
              ]}, function(err, doc){

                // Oggetto che inseriremo ad DB
                // id : [ messaggio, timestamp ]
                var message_id = (chat.id()).toString();
                var message = {};
                message = {
                  '_id' : message_id, 
                  'message': data.message,
                  'timestamp': timestamp
                };

                // Il documento non esiste, creiamolo
                if(err || doc === null) {
                  chat.insert({
                    "user1" : data.user1,
                    "user2" : data.user2, 
                    "data" : {
                      "user1" : [ 
                        message
                      ],
                    }
                  });
                } 
                // Il documento esiste, appendiamo il messaggio
                else {
                  // Dato che non sappiamo con certezza se al livello di 
                  // DB gli utenti sono salvati come user1 o user2, dobbiamo
                  // gestire i due casi
                  if(doc.user1 === data.user1) {
                    chat.update({ _id : doc._id }, 
                      { $push: {'data.user1': message}});
                  } else {
                    chat.update({ _id : doc._id }, 
                      { $push: {'data.user2': message}});
                  }
                }

                // 3. Emissione messaggio via Socket.io
                //    Deve essere dentro la callback del DB 
                //    altrimenti non avremmo il message id
                io.emit('message-' + data.user2, {
                  _id : message_id,
                  user_id : data.user1,
                  message : data.message,
                  timestamp : timestamp
                });

            });
            

          } else {
            console.log('Not authorized');
            // Non abbiamo una richiesta classica,
            // quindi il messaggio di errore lo ritorniamo
            // sempre tramite Socket.io
            io.emit('message-' + data.user1 , "{'error' : 'Not authorized'}");
            return;
          }
        });

      });


    });


}
