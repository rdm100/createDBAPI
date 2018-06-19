const express = require('express');
const parser = require('body-parser');
const app = express();

app.use(parser.json());
app.use(express.static('client/build'));
app.use(parser.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
// const ObjectID = require('mongodb').ObjectID;

MongoClient.connect('mongodb://localhost:27017', function(err, client) {
  if (err) {
    console.log(err);
    return;
  }

  const db = client.db("marvel");

  console.log("Connected to database");

  app.post('/api/heroes', function(req, res, next){
  	const heroesCollection = db.collection('heroes');
  	const heroesToSave = req.body;
  	heroesCollection.save(heroesToSave, function(err, result){
  	if(err) next(err);
  	res.status(204);
  	res.json(result.ops[0]);
  });
});  

  app.get('/api/heroes', function (req, res, next){
  	const heroesCollection = db.collection('heroes');
  	heroesCollection.find().toArray(function(err, allHeroes){
  		if(err) next(err);
  		res.json(allHeroes);
  	});
  });

  app.delete('/api/heroes', function(req, res, next){
  const heroesCollection = db.collection('heroes')
  heroesCollection.remove({}, function(err, result) {
  	if(err) next(err);
  	res.status(200).send();
  });
 });

  const ObjectID = require('mongodb').ObjectID;

  app.post('/api/heroes/:id', function(req, res, next){
  	const heroesCollection = db.collection('heroes');
  	const objectID = ObjectID(req.params.id);
  	heroesCollection.update({_id: objectID}, req.body, function(err, result) {
  		if(err) next(err);
  		res.status(204);
  		res.send();
  	});
  });

  app.delete('/api/heroes/:id', function(req, res, next){
  const heroesCollection = db.collection('heroes')
  const objectID = ObjectID(req.params.id);
  heroesCollection.remove({_id: objectID}, function(err, result) {
  	if(err) next(err);
  	res.status(200).send();
  });
 });

app.listen(3000, function(){
  console.log("Listening on port 3000");
});

})