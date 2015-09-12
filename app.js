var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/tinfinity');
var app = express();

// Required for images upload
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.use(function(req,res,next){
    //penso che non vada bene qui questo

    // Utilizzo questo sistema per passarmi la variabile db 
    // attraverso tutta l'applicazione. Ci sono anche altri
    // modi, come l'export. Se preferisci cambialo.
    // http://stackoverflow.com/a/15039178/1274546
    req.db = db
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res, next) {
  res.render('index');
});

var auth = require('./routes/auth');
app.use('/api/auth', auth);
// All'interno di api.js vengono gestite *tutte*
// le chiamate da parte del cliente *tranne*
// quelle per l'autenticazione
var api = require('./routes/api');
app.use('/api', api);



var debug = require('./routes/debug');
app.use('/debug', debug);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;