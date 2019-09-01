//------------------------------------------------------------------------------
// node.js application
//------------------------------------------------------------------------------
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var app = express();
var bodyParser = require('body-parser');  
var urlencodedParser = bodyParser.urlencoded({ extended: false });  

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

// ROTAS - MOTORISTA
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

app.post('/crt-mot', urlencodedParser, function (req, res) {
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

app.post('/get-mot', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("motorista").findOne({_id: new mongo.ObjectID(req.body._id)}, function(err, result) {
    if (err) throw err;
	res.json(result);
    db.close();
  });
}); 
});

app.post('/upd-mot', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myquery = {_id: new mongo.ObjectID(req.body._id)};
  var newvalues = { $set: {
	  nome: req.body.nome, 
	  dt_nasc: req.body.dt_nasc, 
	  cpf: req.body.cpf, 
	  mod_carro: req.body.mod_carro,
	  status: req.body.status,
	  sexo: req.body.sexo
  }};
  dbo.collection("motorista").updateOne(myquery, newvalues, function(err, result) {
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

app.post('/del-mot', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("motorista").deleteOne({_id: new mongo.ObjectID(req.body._id)}, function(err, result) {
    if (err) throw err;
	res.json(result);
    db.close();
  });
}); 
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

app.post('/get-all-mot-a', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("motorista").find({status: "ATIVO"}).toArray(function(err, result) {
    if (err) throw err;
    res.json(result);
    db.close();
  });
}); 
});





// ROTAS - PASSAGEIRO
app.post('/pas-exists', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("passageiro").findOne({cpf: req.body.cpf}, function(err, result) {
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

app.post('/crt-pas', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = {
	  nome: req.body.nome, 
	  dt_nasc: req.body.dt_nasc, 
	  cpf: req.body.cpf, 
	  sexo: req.body.sexo
  };
  dbo.collection("passageiro").insertOne(myobj, function(err, res) {
    if (err) throw err;
    db.close();
  });
}); 
res.send("");
});

app.post('/get-pas', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("passageiro").findOne({_id: new mongo.ObjectID(req.body._id)}, function(err, result) {
    if (err) throw err;
	res.json(result);
    db.close();
  });
}); 
});

app.post('/upd-pas', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myquery = {_id: new mongo.ObjectID(req.body._id)};
  var newvalues = { $set: {
	  nome: req.body.nome, 
	  dt_nasc: req.body.dt_nasc, 
	  cpf: req.body.cpf, 
	  sexo: req.body.sexo
  }};
  dbo.collection("passageiro").updateOne(myquery, newvalues, function(err, result) {
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

app.post('/del-pas', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("passageiro").deleteOne({_id: new mongo.ObjectID(req.body._id)}, function(err, result) {
    if (err) throw err;
	res.json(result);
    db.close();
  });
}); 
});

app.post('/get-all-pas', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("passageiro").find({}).toArray(function(err, result) {
    if (err) throw err;
    res.json(result);
    db.close();
  });
}); 
});





// ROTAS - CORRIDA
app.post('/cor-exists', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("corrida").findOne({motorista: req.body.motorista, passageiro: req.body.passageiro }, function(err, result) {
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

app.post('/crt-cor', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = {
	  motorista: req.body.motorista, 
	  passageiro: req.body.passageiro,
	  valor: req.body.valor
  };
  dbo.collection("corrida").insertOne(myobj, function(err, res) {
    if (err) throw err;
    db.close();
  });
}); 
res.send("");
});

app.post('/get-cor', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("corrida").findOne({_id: new mongo.ObjectID(req.body._id)}, function(err, result) {
    if (err) throw err;
	res.json(result);
    db.close();
  });
}); 
});

app.post('/upd-cor', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myquery = {_id: new mongo.ObjectID(req.body._id)};
  var newvalues = { $set: {
	  motorista: req.body.motorista, 
	  passageiro: req.body.passageiro,
	  valor: req.body.valor
  }};
  dbo.collection("corrida").updateOne(myquery, newvalues, function(err, result) {
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

app.post('/del-cor', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("corrida").deleteOne({_id: new mongo.ObjectID(req.body._id)}, function(err, result) {
    if (err) throw err;
	res.json(result);
    db.close();
  });
}); 
});

app.post('/get-all-cor', urlencodedParser, function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("corrida").find({}).toArray(function(err, result) {
    if (err) throw err;
    res.json(result);
    db.close();
  });
}); 
});

