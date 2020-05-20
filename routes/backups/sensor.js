
const Config = require('../config/config');
const Common = require('../config/common');
const Sensor = require('../model/sensor.model').Sensor;
const async = require('async');
const moment = require('moment-timezone');
//var cassandra = require('cassandra-driver');
// var client = new cassandra.Client({contactPoints: [process.env.CASSANDRA_IP || '127.0.0.1']});
// client.connect(function(err, result){
// 	console.log('sensor: cassandra connected');
// });


/*
 * GET sensors listing.
 */

function convertToSlug(Text){
    return Text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}

exports.all = function(req, res){

	console.log('sensor:  list');
	let response = Config.base_response;	
	query = {};
	Sensor.getAll(query, function(err, result){
		if(!result){
			console.log('sensor: list not found');
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('sensor: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('sensor', {page_title:"sensor - Node.js", data: result})
		}
		res.json(response);		
	});	
};

/*Save the sensor*/
exports.save = function(req,res){    	
	let response = Config.base_response;
	console.log('sensor: save');
	var input = JSON.parse(JSON.stringify(req.body));	    
	var query = input;
	query.list_field = JSON.parse(query.list_field);
	query.database_name = convertToSlug(input.project_name);	
	Sensor.create(query, function(err, result){
		let respon = Config.base_response;		
		if(err){
			console.log('sensor: add err:', err);			
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {			
			console.log('sensor: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

//sensor Get by username
exports.user = function(req, res){
	console.log('sensor:  list');
	let response = Config.base_response;	
	var user = req.params.user;  	
	var query = { created_by:user };
	Sensor.getAll(query, function(err, result){
		if(err){
			console.log('sensor: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('sensor: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('sensor', {page_title:"sensor - Node.js", data: result})
		}
		res.json(response);		
	});	
};

//sensor Get by id
exports.sensor_detail = function(req, res){
	console.log('sensor: sensor list');
	var id = req.params.id;  	
	let response = Config.base_response;	
	var query = {_id:id};
	Sensor.get(query, function(err, result){
		if(err){
			console.log('sensor: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('sensor: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


/*Edit the sensor*/
exports.edit = function(req,res){    	
	let respon = Config.base_response;
	console.log('sensor: save');	
  	var id = req.params.id;	
  	var user = req.params.user;	  	
  	var input = JSON.parse(JSON.stringify(req.body));	    
  	query = input;
  	var src = { _id:id, created_by:user };
	Sensor.updateByIdAdd(src,query, function(err, result){
		let respon = Config.base_response;		
		if(err){
			console.log('sensor: add err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {			
			console.log('sensor: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(respon);		
	});	
};


/*Delete the sensor*/
exports.delete_sensor = function(req,res){
    var id = req.params.id;
    var user = req.params.user;
    let respon = Config.base_response;
	console.log('sensor: delete');
	console.log(req.params);
	query = {_id:id, created_by:user};
	Sensor.removeById(query, function(err, result){				
		if(err){
			console.log('sensor: del err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {								
			console.log('sensor: del succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(respon);		
	});

};

