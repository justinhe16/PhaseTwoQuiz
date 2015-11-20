var PORT_NUMBER = process.env.PORT || 3000;

// DEPENDENCIES
var async = require('async');
var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var morgan = require('morgan');
var ejs = require('ejs');

var app = express();

// CONFIGURATION
app.use(express.static("./public")); // sets standard files things. i.e /public/imgs will be /imgs; also enables public viewing of files in this folder
app.set('view engine', 'ejs'); //sets view engine
app.set('port', PORT_NUMBER); //sets the port variable to PORT_NUMBER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));

// ROUTING
app.get('/', function(request, response) {
  var QUIZARRAY =  {titles:[], id:[]};
  var FULLQUIZ = require('./data/quiz.json');
  for (var tracker = 0; tracker < FULLQUIZ.length; tracker++){
      QUIZARRAY.titles.push(FULLQUIZ[tracker].title);
      QUIZARRAY.id.push(FULLQUIZ[tracker].id);
  }
  response.render('index.ejs', {stuff: QUIZARRAY});
});

app.get('/quiz', function(request, response) {
  var QUIZARRAY =  {titles:[], id:[]};
  var FULLQUIZ = require('./data/quiz.json');
  for (var tracker = 0; tracker < FULLQUIZ.length; tracker++){
      QUIZARRAY.titles.push(FULLQUIZ[tracker].title);
      QUIZARRAY.id.push(FULLQUIZ[tracker].id);
  }
  response.render('index.ejs', {stuff: QUIZARRAY});
});

app.get('/quiz/:id', function(request, response) {
  var ID = request.params.id;
  var FULLQUIZ = require('./data/quiz.json');
  var SELECTEDQUIZ = FULLQUIZ[ID-1];
  var TOBSESENTQUIZ = JSON.stringify(SELECTEDQUIZ);
  response.send(SELECTEDQUIZ);
});

app.get('/gettopJSON', function(request, response) {
  var a = require('./data/top10.json');
  response.send(a);
});

app.post('/quiz', function(request, response) {
  var Tobestoredjson = JSON.stringify(request.body, null, 4);
  console.log(Tobestoredjson);
  fs.writeFile('./data/quiz.json', Tobestoredjson, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
  });
  response.send(Tobestoredjson + "fire");
});

app.post('/top', function(request, response) {
  var Tobestoredtopjson = JSON.stringify(request.body, null, 4);
  console.log(Tobestoredtopjson);
  fs.writeFile('./data/top10.json', Tobestoredtopjson, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
  });
  response.send(Tobestoredtopjson + "fire");
});

// SERVER SETUP
app.listen(PORT_NUMBER, function() {
  console.log('Listening to port ' + PORT_NUMBER);
});
