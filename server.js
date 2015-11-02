var PORT_NUMBER = process.env.PORT || 3000;

// DEPENDENCIES
var async = require('async');
var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var morgan = require('morgan');
var https = require('https');

var app = express();

// CONFIGURATION
app.use(express.static("./public")); // sets standard files things. i.e /public/imgs will be /imgs; also enables public viewing of files in this folder
app.set('view engine', 'html'); //sets view engine
app.set('port', PORT_NUMBER); //sets the port variable to PORT_NUMBER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));

// ROUTING
app.get('/', function(request, response) {
  response.render('index.html');
});

app.post('/quiz', function(request, response) {
  var Tobestoredjson = JSON.stringify(request.body, null, 4);
  console.log(Tobestoredjson);
  fs.writeFile('./public/js/quiz.json', Tobestoredjson, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
  });
  response.send(Tobestoredjson + "fire");
});

// SERVER SETUP
var server = require('http').Server(app);
server.listen(PORT_NUMBER, function() {
  console.log('Listening to port ' + PORT_NUMBER);
});
