// https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
// https://github.com/monsterlessons/18-angular-http
// https://www.w3schools.com/nodejs/nodejs_filesystem.asp
// https://stackoverflow.com/questions/6456864/why-does-node-js-fs-readfile-return-a-buffer-instead-of-string
// https://stackoverflow.com/questions/3459476/how-to-append-to-a-file-in-node
// https://stackoverflow.com/questions/3459476/how-to-append-to-a-file-in-node/43370201#43370201

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var fs = require('fs');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

app.use(express.static(__dirname + '/app'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

var text = fs.readFileSync(__dirname + '/app/data/users.json', 'utf8');
// console.log('text', text);
var users = JSON.parse(text);
// console.log(users[0].name);
var stream = fs.createWriteStream(__dirname + '/app/data/users.json', { flags: 'a' });


app.get('/data/users', function (req, res) {
  fs.readFile(__dirname + '/app/data/users.json', 'utf8', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    // console.log('__dirname',__dirname);
    // console.log('process.cwd()',process.cwd());
    // __dirname ===  process.cwd()
    // console.log('data',data);
    // console.log(err);
    res.end(data);
  });
});

app.post('/newuser', function (req, res) {
  // console.log('req', req.body);
  var newUser = req.body;
  users.push(newUser);
  console.log('users', users);
  fs.writeFile(__dirname + '/app/data/users.json', JSON.stringify(users), 'utf8', function (err) {
    if (err) {
      return console.log(err);
    };
  });
  stream.write(JSON.stringify(newUser));
  res.send(newUser);
});

var server = app.listen(3001, function () {
  console.log('backend started');
});