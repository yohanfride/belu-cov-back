
const Config = require('../config/config');
const Common = require('../config/common');
const Visual = require('../model/visual.model').Visual;
const async = require('async');
const moment = require('moment-timezone');
//var cassandra = require('cassandra-driver');
// var client = new cassandra.Client({contactPoints: [process.env.CASSANDRA_IP || '127.0.0.1']});
// client.connect(function(err, result){
// 	console.log('Visual: cassandra connected');
// });


/*
 * GET Visuals listing.
 */

function convertToSlug(Text){
    return Text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}

exports.all = function(req, res){
	console.log('Visual:  list');
	let response = Config.base_response;	
	query = {};
	Visual.getAll(query, function(err, result){
		if(!result){
			console.log('Visual: list not found');
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('Visual: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('Visual', {page_title:"Visual - Node.js", data: result})
		}
		res.json(response);		
	});	
};

/*Save the Visual*/
exports.save = function(req,res){    	
	let response = Config.base_response;
	console.log('Visual: save');
	var input = JSON.parse(JSON.stringify(req.body));	    
	var query = input;
	query.kode = convertToSlug(input.title);	
	query.maps = JSON.parse(query.maps);
	query.table = JSON.parse(query.table);
	query.graph = JSON.parse(query.graph);	
	
	Visual.create(query, function(err, result){
		let respon = Config.base_response;		
		if(err){
			console.log('Visual: add err:', err);			
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {			
			console.log('Visual: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

//Visual Get by username
exports.project = function(req, res){
	console.log('Visual:  list');
	let response = Config.base_response;	
	var project = req.params.id;  	
	var query = { project_id:project };
	Visual.get(query, function(err, result){
		if(err){
			console.log('Visual: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('Visual: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('Visual', {page_title:"Visual - Node.js", data: result})
		}
		res.json(response);		
	});	
};

//Visual Get by id
exports.visual_detail = function(req, res){
	console.log('Visual: Visual list');
	var id = req.params.id;  	
	let response = Config.base_response;	
	var query = {_id:id};
	Visual.get(query, function(err, result){
		if(err){
			console.log('Visual: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('Visual: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

//Visual Get by id
exports.search = function(req, res){
	console.log('Visual: Search');
	var input = JSON.parse(JSON.stringify(req.body));	
	let response = Config.base_response;
	query = input;		
	console.log(query);
	Visual.get(query, function(err, result){
		if(err){
			console.log('Visual: Search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('Visual: Search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


/*Edit the Visual*/
exports.edit = function(req,res){    	
	let respon = Config.base_response;
	console.log('Visual: save');	
  	var id = req.params.id;		  	
  	var input = JSON.parse(JSON.stringify(req.body));	    
	var query = input;
	query.kode = convertToSlug(input.title);	
	query.maps = JSON.parse(query.maps);
	query.table = JSON.parse(query.table);
	query.graph = JSON.parse(query.graph);	
  	var src = { _id:id};
	Visual.updateByIdAdd(src,query, function(err, result){
		let respon = Config.base_response;		
		if(err){
			console.log('Visual: add err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {			
			console.log('Visual: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(respon);		
	});	
};



/*Delete the Visual*/
exports.delete_visual = function(req,res){
    var id = req.params.id;
    var user = req.params.user;
    let respon = Config.base_response;
	console.log('Visual: delete');
	console.log(req.params);
	query = {_id:id, created_by:user};
	Visual.removeById(query, function(err, result){				
		if(err){
			console.log('Visual: del err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {								
			console.log('Visual: del succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(respon);		
	});

};

