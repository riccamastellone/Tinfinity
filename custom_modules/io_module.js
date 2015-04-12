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
      socket.on('chat message', function(msg){
        console.log('message: ' + msg);
      });


    });


}
