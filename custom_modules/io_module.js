
//CAPIRE DOVE METTERLE PER FARE UNA COSA FATTA BENE
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/tinfinity');
var messageSample = db.get('messagesample')

/**
*  Module that exports the events and the functions related to socket.io module
**/
module.exports = function (io) {

    /*---------------------- Socket.io events ----------------------*/

    /**
    * Event emitted when the user connects
    */
    io.on('connection', function(socket){
      console.log('a user connected');

      //message passed
      socket.on('message', function(msg){

        console.log('message: ' + msg);
        //save the received message in mongo db and, when the task is done send the reply to the client

        messageSample.insert(msg, function (err, results) {
                if (err) return next(err);
                io.emit('reply', value)
        } )

      });


    });


}
