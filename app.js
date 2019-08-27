/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

var bodyParser = require('body-parser');  
var urlencodedParser = bodyParser.urlencoded({ extended: false })  

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

var mongo = require('mongodb'); 

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://teste:teste123@mongo-t-qnccn.gcp.mongodb.net/test?retryWrites=true&w=majority";

// Verificar se usuário ja existe
app.post('/mot-exists', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("motorista").findOne({cpf: req.body.cpf}, function(err, result) {
    if (err) throw err;
	if(result != null){
		res.json({ ok: 'ok' }); 
	}else{
		res.json(result); 
	}
    db.close();
  });
}); 
});

app.post('/register-motorista', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = {
	  nome: req.body.nome, 
	  dt_nasc: req.body.dt_nasc, 
	  cpf: req.body.cpf, 
	  mod_carro: req.body.mod_carro,
	  status: req.body.status,
	  sexo: req.body.sexo
  };
  dbo.collection("motorista").insertOne(myobj, function(err, res) {
    if (err) throw err;
    db.close();
  });
}); 
res.send("");
});

app.post('/get-all-mot', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("motorista").find({}).toArray(function(err, result) {
    if (err) throw err;
    res.json(result);
    db.close();
  });
}); 
});
