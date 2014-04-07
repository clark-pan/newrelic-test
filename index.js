var express = require('express');
var hbs = require('express-hbs');
var newrelic = require('newrelic');
var app = express();

app.engine('hbs', hbs.express3({
  partialsDir: __dirname + '/server/views'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/server/views');

app.use(express.static('bower_components'));
app.use(express.static('client'));

app.get('/', function (req, res){
  newrelic.setTransactionName('test');
  res.render('index', {
    newRelicScript : newrelic.getBrowserTimingHeader(),
    vendorScripts : [
      {
        src : "angular/angular.js"
      }
    ],
    appScripts : [
      {
        src: "main.js"
      }
    ]
  });
});

app.post('/url/that/should/500', function(req, res){
  res.status(500).send({
    'err' : 'An unexpected error has occured'
  });
});

app.listen(3002);