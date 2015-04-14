var mongoWrapper = require('../custom_modules/mongo_wrapper_module.js')
var messageSample = require('../database/models/message_sample.js');

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
        mongoWrapper.create(messageSample, msg, function(value){ io.emit('reply', value) } )

      });


    });


}
