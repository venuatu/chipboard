var _ = require('lodash'),
    io = require('socket.io'),
    bodyParser = require('body-parser'),
    feedStore = require('./src/scripts/feedStore.js'),
    express = require('express'),
    React = require('react/addons'),
    Router = require('react-router'),
    clientSide = React.createFactory(require('./src/scripts/clientSide.js'));// created with `grunt build` (webpack)

var song = '', tweets = [];

var app = require('express')();
var http = require('http').Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  var initialState = feedStore.getSince(),
      content = React.renderToString(clientSide(initialState));

  res.send('<!doctype html><html><head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> <title>Chipboard</title> <meta name="description" content=""> <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>html,body{background-color:#222;}</style></head><body> <!--[if lt IE 8]> <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>  <![endif]-->  <div id="react-hole">'+ content +'</div> <script type="application/json" id="initial-state">'+ escape(JSON.stringify(initialState)) +'</script> <script type="text/javascript" src="assets/main.js"></script></body></html>');
});

app.use(express.static(__dirname + '/dist'));

var port = parseInt(process.env.PORT, 10) || 3000;

http.listen(port, function(){
  console.log('listening on *:'+ port);
});

io = io(http);

io.on('connection', function (sock) {
  sock.on('since', function (filter) {
    sock.emit('state', feedStore.getSince(filter));
  });
});

app.get('/state', function (req, res) {
  res.send(feedStore.getSince());
});

feedStore.register(function (name, object) {
  console.log(name, object.time.toISOString(), object.service, object.text || object.url || JSON.stringify(object));
  io.emit(name, object);
});

var sources = _.chain((process.env.SOURCES || '').split(',')).compact().value();
if (sources.length == 0)
  sources = require('fs').readdirSync('./src/scripts/sources/').filter(RegExp.prototype.test.bind(/\.js/));

console.log('sources: ', JSON.stringify(sources, null, 2));

_.chain(sources).map(function (name) {return './src/scripts/sources/'+ name})
.each(function (source) {
  require(source)(app, feedStore);
});
