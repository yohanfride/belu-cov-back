
const Config = require('../config/config');
const Common = require('../config/common');
const kuisoner = require('../model/kuisoner.model').Kuisoner;
const async = require('async');
const moment = require('moment-timezone');
//var cassandra = require('cassandra-driver');
// var client = new cassandra.Client({contactPoints: [process.env.CASSANDRA_IP || '127.0.0.1']});
// client.connect(function(err, result){
// 	console.log('kuisoner: cassandra connected');
// });


/*
 * GET kuisoners listing.
 */

function convertToSlug(Text){
    return Text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}

exports.all = function(req, res){
	console.log('kuisoner:  list');
	let response = Config.base_response;	
	query = {};
	kuisoner.getAll(query, function(err, result){
		if(!result){
			console.log('kuisoner: list not found');
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('kuisoner: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('kuisoner', {page_title:"kuisoner - Node.js", data: result})
		}
		res.json(response);		
	});	
};

/*Save the kuisoner*/
exports.save = function(req,res){    	
	let response = Config.base_response;
	console.log('kuisoner: save');
	var input = JSON.parse(JSON.stringify(req.body));	    
	var idk = input.id_kuisoner;
	delete input.id_kuisoner;
	var query = {
		id_athlete : req.params.id,
		id_kuisoner : idk,
		kuisoner : input
	};
	kuisoner.create(query, function(err, result){
		let respon = Config.base_response;		
		if(err){
			console.log('kuisoner: add err:', err);			
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {			
			console.log('kuisoner: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

//kuisoner Get by username
exports.search = function(req, res){
	console.log('kuisoner:  list');
	var input = JSON.parse(JSON.stringify(req.body));	
	let response = Config.base_response;
	query = input;		  	
	kuisoner.getAll(query, function(err, result){
		if(err){
			console.log('kuisoner: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('kuisoner: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('kuisoner', {page_title:"kuisoner - Node.js", data: result})
		}
		res.json(response);		
	});	
};

//kuisoner Get by username
exports.search_count = function(req, res){
	console.log('kuisoner:  list');
	var input = JSON.parse(JSON.stringify(req.body));	
	let response = Config.base_response;
	query = input;		  	
	kuisoner.getCount(query, function(err, result){
		if(err){
			console.log('kuisoner: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('kuisoner: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('kuisoner', {page_title:"kuisoner - Node.js", data: result})
		}
		res.json(response);		
	});	
};

//kuisoner Get by username
exports.src_coach = function(req, res){
	console.log('kuisoner:  list');
	var input = JSON.parse(JSON.stringify(req.body));	
	let response = Config.base_response;
	//query = input;			
	var dt = JSON.parse(input.or);	
	var query = {'$or':dt};
	console.log(query);
	kuisoner.getAll(query, function(err, result){
		if(err){
			console.log('kuisoner: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('kuisoner: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('kuisoner', {page_title:"kuisoner - Node.js", data: result})
		}
		res.json(response);		
	});	
};

//kuisoner Get by username
exports.src_coach_count = function(req, res){
	console.log('kuisoner:  list');
	var input = JSON.parse(JSON.stringify(req.body));	
	let response = Config.base_response;
	//query = input;			
	var dt = JSON.parse(input.or);	
	var query = {'$or':dt};
	console.log(query);
	kuisoner.getCount(query, function(err, result){
		if(err){
			console.log('kuisoner: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('kuisoner: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('kuisoner', {page_title:"kuisoner - Node.js", data: result})
		}
		res.json(response);		
	});	
};

//kuisoner Get by id
exports.detail = function(req, res){
	console.log('kuisoner: kuisoner list');
	var id = req.params.id;  	
	let response = Config.base_response;	
	var query = {_id:id};
	kuisoner.get(query, function(err, result){
		if(err){
			console.log('kuisoner: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('kuisoner: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


/*Edit the kuisoner*/
exports.edit = function(req,res){    	
	let respon = Config.base_response;
	console.log('kuisoner: save');	
  	var id = req.params.id;	 	
  	var input = JSON.parse(JSON.stringify(req.body));	      	
  	var query = {kuisoner:input};
  	var src = { _id:id};
	kuisoner.updateByIdAdd(src,query, function(err, result){
		let respon = Config.base_response;		
		if(err){
			console.log('kuisoner: add err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {			
			console.log('kuisoner: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(respon);		
	});	
};


/*Delete the kuisoner*/
exports.delete = function(req,res){
    var id = req.params.id;
    var user = req.params.user;
    let respon = Config.base_response;
	console.log('kuisoner: delete');
	console.log(req.params);
	query = {_id:id};
	kuisoner.removeById(query, function(err, result){				
		if(err){
			console.log('kuisoner: del err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {								
			console.log('kuisoner: del succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(respon);		
	});

};

