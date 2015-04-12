/**
*  Module that exports the events and the functions related to socket.io module
**/
module.exports = function (io) {

    /*---------------------- Socket.io events ----------------------*/

    io.on('connection', function(socket){
      console.log('a user connected');
    });


}
