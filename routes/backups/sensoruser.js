
const Config = require('../config/config');
const Common = require('../config/common');
const Sensor = require('../model/sensor.model').Sensor;
const async = require('async');
const moment = require('moment-timezone');
const Influx = require('influx');
// var client = new cassandra.Client({contactPoints: [process.env.CASSANDRA_IP || '127.0.0.1']});
// client.connect(function(err, result){
// 	console.log('sensor: cassandra connected');
// });

const influxClient = new Influx.InfluxDB({
    host: Config.influxdb.host,
    port: Config.influxdb.port,
    protocol: Config.influxdb.protocol,
    username: Config.influxdb.username,
    password: Config.influxdb.password,
    database: Config.influxdb.database
})

function createDb(dbname){
	influxClient.getDatabaseNames()
	  .then(names => {
	    //if (!names.includes('express_response_db')) {	      
	      return influxClient.createDatabase(dbname)
	    //}
	  })  
	  .catch(err => {
	    console.error(`Error creating Influx database!`+err)
	  })
}

/*
 * GET sensors listing.
 */


//Make InfluxDB

exports.make_influxdb = function(req, res){
	console.log('sensor user: make influxdb');
	var id = req.params.id;  	
	let response = Config.base_response;	
	var query = {_id:id}
	console.log(query);
	Sensor.get(query, function(err, result){
		if(err){
			console.log('sensor: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			var influx = "sensor_"+result.created_by+"_"+result.database_name;
			console.log("influx");
			createDb(influx);			
			Sensor.updateByIdAdd({_id:id},{build_influx:true}, function(err, result){ });								
			console.log('sensor user: make influxdb succ:');			
			response.is_success = true;
			response.description = 'success';
			response.data = "success";
		}
		res.json(response);		
	});	
};


exports.make_database = function(req, res){
	console.log('sensor user: make influxdb');
	var id = req.params.id;  	
	let response = Config.base_response;	
	var query = {_id:id}
	console.log(query);
	Sensor.updateByIdAdd({_id:id},{build_db:true}, function(err, result){
		if(err){
			console.log('sensor: make database err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {						
			console.log('sensor user: make database succ:');			
			response.is_success = true;
			response.description = 'success';
			response.data = "success";
		}
		res.json(response);		
	});	
};




// //sensor Get by id
// exports.make_database = function(req, res){
// 	console.log('sensor: sensor list');
// 	var id = req.params.id;  	
// 	let response = Config.base_response;	
// 	client.execute("SELECT * FROM semar.sensor WHERE id = "+id+" ALLOW FILTERING",[], function(err, result){
// 		if(err){
// 			console.log('sensor: detail err:', err);
// 			response.is_success = false;
// 			response.description = 'Failed';
// 			response.data = err;			
// 		} else {
// 			var obj = result.rows[0].list_field;
// 			var user = result.rows[0].username;
// 			var CQL = "CREATE COLUMNFAMILY semar.sensor_"+result.rows[0].username+"_"+result.rows[0].database_name
// 					  +"( time timestamp, label text, value float,";
// 			Object.keys(obj).forEach(function(key){
// 			   CQL += key + " " + obj[key] + ", ";
// 			   //console.log(key + '=' + obj[key]);
// 			});

// 			CQL+= " PRIMARY KEY(time) )";
// 			client.execute(CQL,[], function(err, result){
// 				if(err){
// 					console.log('sensor user: make err:', err);
// 					response.is_success = false;
// 					response.description = 'Failed';
// 					response.data = err;			
// 				} else {
// 					client.execute("UPDATE semar.sensor SET build_db = 1 WHERE username = '"+user+"' AND id = " + id+" IF EXISTS",[], function(err, result){ });					
// 					console.log('sensor user: make succ:', result);			
// 					response.is_success = true;
// 					response.description = 'success';
// 					response.data = "success";							
// 				}
// 				res.json(response);		
// 			});						
// 		}
// 		res.json(response);		
// 	});	
// };

exports.remove_database = function(req, res){
	console.log('sensor: sensor list');
	var id = req.params.id;  	
	let response = Config.base_response;	
	client.execute("SELECT * FROM semar.sensor WHERE id = "+id+" ALLOW FILTERING",[], function(err, result){
		if(err){
			console.log('sensor: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			var obj = result.rows[0].list_field;
			var user = result.rows[0].username;
			var CQL = "DROP COLUMNFAMILY semar.sensor_"+result.rows[0].username+"_"+result.rows[0].database_name
			client.execute(CQL,[], function(err, result){
				if(err){
					console.log('sensor user: remove database err:', err);
					response.is_success = false;
					response.description = 'Failed';
					response.data = err;			
				} else {					
					client.execute("UPDATE semar.sensor SET build_db = 0   WHERE username = '"+user+"' AND id = " + id+" IF EXISTS",[], function(err, result){ });					
					console.log('sensor user: remove database succ:', result);			
					response.is_success = true;
					response.description = 'success';
					response.data = "success";			
				}
				res.json(response);		
			});						
		}
		res.json(response);		
	});	
};

//sensor Get by id
exports.mqtt_insert = function(req, res){
	console.log('sensor: mqtt insert');
	var input = JSON.parse(JSON.stringify(req.body));		
	let response = Config.base_response;	
	client.execute(input.cql,[], function(err, result){
		if(err){
			console.log('sensor: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			response.is_success = true;
			response.description = 'success';
			response.data = "success";							
		}
		res.json(response);		
	});	
};