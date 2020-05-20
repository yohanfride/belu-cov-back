var MongoClient = require('mongodb').MongoClient;
const config = require('../config/config');


exports.add = function(req, res){	
	var input = JSON.parse(JSON.stringify(req.body));	    
	var query = JSON.parse(input.data);		
	var col = input.col;	
	MongoClient.connect(config.database.url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(config.database.db);	  
	  var myobj =  query;
	  dbo.collection(col).insertOne(myobj, function(err, res) {
	    if (err) throw err;
	    console.log("1 document inserted");
	    db.close();
	  });
	}); 
};

exports.push_add = function(req, res){	
	var input = JSON.parse(JSON.stringify(req.body));	    
	var query = JSON.parse(input.data);		
	var id = JSON.parse(input.id);		
	var col = input.col;	
	
	MongoClient.connect(config.database.url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(config.database.db);	  
	  var myquery = id ;
	   console.log(myquery);
	  var newvalues = { $push: query};
	  dbo.collection(col).updateOne(myquery, newvalues, function(err, res) {
	    if (err) throw err;
	    console.log("1 document updated");
	    db.close();
	  });
	}); 

};

