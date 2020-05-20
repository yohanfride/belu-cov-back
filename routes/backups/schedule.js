
const Config = require('../config/config');
const Common = require('../config/common');
const schedule = require('../model/schedule.model').Schedule;
const async = require('async');
const moment = require('moment-timezone');
//var cassandra = require('cassandra-driver');
// var client = new cassandra.Client({contactPoints: [process.env.CASSANDRA_IP || '127.0.0.1']});
// client.connect(function(err, result){
// 	console.log('schedule: cassandra connected');
// });


/*
 * GET schedules listing.
 */

function convertToSlug(Text){
    return Text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}

exports.all = function(req, res){
	console.log('schedule:  list');
	let response = Config.base_response;	
	query = {};
	schedule.getAll(query, function(err, result){
		if(!result){
			console.log('schedule: list not found');
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('schedule: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('schedule', {page_title:"schedule - Node.js", data: result})
		}
		res.json(response);		
	});	
};

/*Save the schedule*/
exports.save = function(req,res){    	
	let response = Config.base_response;
	console.log('schedule: save');
	var input = JSON.parse(JSON.stringify(req.body));	    
	var query = input;	
	schedule.create(query, function(err, result){
		let respon = Config.base_response;		
		if(err){
			console.log('schedule: add err:', err);			
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {			
			console.log('schedule: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

//schedule Get by username
exports.search = function(req, res){
	console.log('schedule:  list');
	var input = JSON.parse(JSON.stringify(req.body));	
	let response = Config.base_response;
	query = input;		  	
	schedule.getAll(query, function(err, result){
		if(err){
			console.log('schedule: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('schedule: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('schedule', {page_title:"schedule - Node.js", data: result})
		}
		res.json(response);		
	});	
};

//schedule Get by username
exports.search_count = function(req, res){
	console.log('schedule:  list');
	var input = JSON.parse(JSON.stringify(req.body));	
	let response = Config.base_response;
	query = input;		  	
	schedule.getCount(query, function(err, result){
		if(err){
			console.log('schedule: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('schedule: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('schedule', {page_title:"schedule - Node.js", data: result})
		}
		res.json(response);		
	});	
};

//schedule Get by id
exports.detail = function(req, res){
	console.log('schedule: schedule list');
	var id = req.params.id;  	
	let response = Config.base_response;	
	var query = {_id:id};
	schedule.get(query, function(err, result){
		if(err){
			console.log('schedule: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('schedule: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


/*Edit the schedule*/
exports.edit = function(req,res){    	
	let respon = Config.base_response;
	console.log('schedule: save');	
  	var id = req.params.id;	 	
  	var input = JSON.parse(JSON.stringify(req.body));	    
  	query = input;  	
  	var src = { _id:id};
	schedule.updateByIdAdd(src,query, function(err, result){
		let respon = Config.base_response;		
		if(err){
			console.log('schedule: add err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {			
			console.log('schedule: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(respon);		
	});	
};


/*Delete the schedule*/
exports.delete = function(req,res){
    var id = req.params.id;
    var user = req.params.user;
    let respon = Config.base_response;
	console.log('schedule: delete');
	console.log(req.params);
	query = {_id:id};
	schedule.removeById(query, function(err, result){				
		if(err){
			console.log('schedule: del err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {								
			console.log('schedule: del succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(respon);		
	});

};

