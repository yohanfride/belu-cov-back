var MongoClient = require('mongodb').MongoClient

var URL = 'mongodb://localhost:27017/test'

MongoClient.connect(URL, function(err, db) {
  	if (err) return
  	dbo = db.db("semar");
  	var collection = dbo.collection('user')  
    collection.find().toArray(function(err, docs) {
      	console.log(docs)      
  	})  
})