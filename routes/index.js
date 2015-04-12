var express = require('express');
var app = require('express')();
var router = express.Router();

//load modules
var http = require('http').Server(app);
var io = require('socket.io')(http);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/chat', function(req, res) {
  res.render('chat');
});


/*---------------------- Socket.io events ----------------------*/

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


module.exports = router;
