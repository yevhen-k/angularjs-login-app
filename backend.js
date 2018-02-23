// https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
// https://github.com/monsterlessons/18-angular-http
// https://www.w3schools.com/nodejs/nodejs_filesystem.asp
// https://stackoverflow.com/questions/6456864/why-does-node-js-fs-readfile-return-a-buffer-instead-of-string
// https://stackoverflow.com/questions/3459476/how-to-append-to-a-file-in-node
// https://stackoverflow.com/questions/3459476/how-to-append-to-a-file-in-node/43370201#43370201
// http://mongoosejs.com/docs/index.html
// https://www.mongodb.com/compare/mongodb-mysql
// https://www.tutorialspoint.com/mongodb
// https://www.w3schools.com/nodejs -- mongodb chapter
// https://www.npmjs.com/package/password-hash
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
// https://nodejs.org/api/crypto.html list of available algorithms> openssl list-message-digest-algorithms

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var fs = require('fs');
var mongoose = require('mongoose');
var app = express();
var passwordHash = require('password-hash');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

mongoose.connect('mongodb://localhost:27017/usersDB');     // connect to mongoDB database on modulus.io
app.use(express.static(__dirname + '/app'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


var db = mongoose.connection;
db.on('error', function(){
  console.error('error connection to db');
});
db.once('open', function() {
  console.log('connected to db successfully!');
  // create schema
  var userScema = mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    password: String,
    isBlocked: Boolean,
    events: [],
    isCurrentlyActive: Boolean,
    cookie: String
  });
  // compiling schema to model
  var User = mongoose.model('User', userScema);
  app.get('/data/users', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    User.find(function (err, users) {
      if (err) return console.error(err);
      res.end(JSON.stringify(users));
    });
  });
  app.post('/register', function (req, res){
    var userDetailsFromRequest = req.body;
    var hashedPass = passwordHash.generate(userDetailsFromRequest.password);
    var newUser = new User({ 
      id: userDetailsFromRequest.id,
      name: userDetailsFromRequest.name,
      email: userDetailsFromRequest.email,
      password: hashedPass,
      isBlocked: userDetailsFromRequest.isBlocked,
      events: userDetailsFromRequest.events,
      isCurrentlyActive: userDetailsFromRequest.isCurrentlyActive
    });
    newUser.save(function (err, newUser) {
      res.send(newUser);
    });
  });
  app.post('/login', function(req, res){
    var userDetailsFromRequest = req.body;
    // recieved data from user
    console.log('/login userDetailsFromRequest', userDetailsFromRequest);
    var hashedPass = passwordHash.generate(userDetailsFromRequest.password);
    console.log('/login hashedPass', hashedPass);
    User.find({email: userDetailsFromRequest.email, password: hashedPass}, function (err, user) {
      // if user not found then user is empty array
      if (err) return console.error(err);
      if(user.length !== 0) {
        console.log('/login user is found', user);
        // create new cookie
        var cookieValue = makeCookieBetter();
        var cookieName = 'SID';
        var cookie = cookieName + '=' + cookieValue;
        // add cookie to DB
        var query = {
          email: userDetailsFromRequest.email,
          password: hashedPass
        };
        var updateCookie = {cookie: cookie};
        var option = {new: true};
        User.findOneAndUpdate(query, updateCookie, option, function(err, updatedUser){
          console.log('/login seinding info to user', updatedUser);
          res.send(updatedUser);
        });
      } else {
        console.log('/login user is NOT found', user);
        res.send(user);
      }
    });
  });
  app.post('/validatesession', function(req, res){
    var userCredentialFromRequest = req.body;
    console.log('/validatesession', req.body);
    User.find({cookie: userCredentialFromRequest.cookie}, function(err, userCred){
      console.log('/validation post query res', userCred);
      if (err) return console.error(err);
      if(userCred.length !== 0) {
        console.log('session is found', userCred);
        res.send({cookiesValid: true, id: userCred[0].id, email: userCred[0].email, name: userCred[0].name});
      } else {
        console.log('session NOT found', userCred);
        res.send({cookiesValid: false});
      }
    });
  });
  app.post('/logout', function(req, res){
    var userEmail = req.body.email;
    console.log('/logout userEmail', req.body);
    User.update({email: userEmail}, { cookie: '' }, function(err, data){
      console.log('user has been logged out', data, new Date().toString());
    });
  });
});

var server = app.listen(3001, function () {
  console.log('backend started');
});

function makeCookie() {
  var cookie = "";
  var source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 15; i++) {
    cookie += source.charAt(Math.floor(Math.random() * source.length));
  }
  return cookie;
}

function makeCookieBetter(){
  return  Math.random().toString(36).substring(2) +
          Math.random().toString(36).substring(2) + 
          Math.random().toString(36).substring(2);
}