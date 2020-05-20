
const Config = require('../config/config');
const Common = require('../config/common');
const kontenkuisoner = require('../model/kontenkuisoner.model').KontenKuisoner;
const async = require('async');
const moment = require('moment-timezone');
//var cassandra = require('cassandra-driver');
// var client = new cassandra.Client({contactPoints: [process.env.CASSANDRA_IP || '127.0.0.1']});
// client.connect(function(err, result){
// 	console.log('kontenkuisoner: cassandra connected');
// });


/*
 * GET kontenkuisoners listing.
 */

function convertToSlug(Text){
    return Text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}

exports.all_title =function(req, res){
	console.log('kontenkuisoner:  list');
	let response = Config.base_response;	
	query = {type_kuisoner:1};
	kontenkuisoner.getAll(query, function(err, result){
		if(!result){
			console.log('kontenkuisoner: list not found');
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('kontenkuisoner: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('kontenkuisoner', {page_title:"kontenkuisoner - Node.js", data: result})
		}
		res.json(response);		
	});	
};

exports.all_title_count =function(req, res){
	console.log('kontenkuisoner:  list');
	let response = Config.base_response;	
	query = {type_kuisoner:1};
	kontenkuisoner.getCount(query, function(err, result){
		if(!result){
			console.log('kontenkuisoner: list not found');
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('kontenkuisoner: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('kontenkuisoner', {page_title:"kontenkuisoner - Node.js", data: result})
		}
		res.json(response);		
	});	
};

exports.all_konten =function(req, res){
	console.log('kontenkuisoner:  list');
	let response = Config.base_response;	
	id = req.params.id;
	query = {type_kuisoner:2,id_parent:id};
	kontenkuisoner.getAll(query, function(err, result){
		if(!result){
			console.log('kontenkuisoner: list not found');
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('kontenkuisoner: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('kontenkuisoner', {page_title:"kontenkuisoner - Node.js", data: result})
		}
		res.json(response);		
	});	
};

/*Save the kontenkuisoner*/
exports.save = function(req,res){    	
	let response = Config.base_response;
	console.log('kontenkuisoner: save');
	var input = JSON.parse(JSON.stringify(req.body));	    
	var query = input;	
	query.field = convertToSlug(input.field);	
	kontenkuisoner.create(query, function(err, result){
		let respon = Config.base_response;		
		if(err){
			console.log('kontenkuisoner: add err:', err);			
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {			
			console.log('kontenkuisoner: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = result;			
		}
		res.json(response);		
	});	
};

//kontenkuisoner Get by username
exports.search = function(req, res){
	console.log('kontenkuisoner:  list');
	var input = JSON.parse(JSON.stringify(req.body));	
	let response = Config.base_response;
	query = input;		  	
	kontenkuisoner.getAll(query, function(err, result){
		if(err){
			console.log('kontenkuisoner: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('kontenkuisoner: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('kontenkuisoner', {page_title:"kontenkuisoner - Node.js", data: result})
		}
		res.json(response);		
	});	
};


//kontenkuisoner Get by id
exports.detail = function(req, res){
	console.log('kontenkuisoner: kontenkuisoner list');
	var id = req.params.id;  	
	let response = Config.base_response;	
	var query = {_id:id};
	kontenkuisoner.get(query, function(err, result){
		if(err){
			console.log('kontenkuisoner: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('kontenkuisoner: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


/*Edit the kontenkuisoner*/
exports.edit = function(req,res){    	
	let respon = Config.base_response;
	console.log('kontenkuisoner: save');	
  	var id = req.params.id;	 	
  	var input = JSON.parse(JSON.stringify(req.body));	    
  	query = input;
  	query.field = convertToSlug(input.field);
  	var src = { _id:id};
	kontenkuisoner.updateByIdAdd(src,query, function(err, result){
		let respon = Config.base_response;		
		if(err){
			console.log('kontenkuisoner: add err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {			
			console.log('kontenkuisoner: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(respon);		
	});	
};


/*Delete the kontenkuisoner*/
exports.delete = function(req,res){
    var id = req.params.id;
    var user = req.params.user;
    let respon = Config.base_response;
	console.log('kontenkuisoner: delete');
	console.log(req.params);
	query = {_id:id};
	kontenkuisoner.removeById(query, function(err, result){				
		if(err){
			console.log('kontenkuisoner: del err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {								
			console.log('kontenkuisoner: del succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(respon);		
	});

};

/*Delete the kontenkuisoner*/
exports.delete_child = function(req,res){
    var id = req.params.id;
    var user = req.params.user;
    let respon = Config.base_response;
	console.log('kontenkuisoner: delete');
	console.log(req.params);
	query = {id_parent:id};
	kontenkuisoner.removeById(query, function(err, result){				
		if(err){
			console.log('kontenkuisoner: del err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {								
			console.log('kontenkuisoner: del succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(respon);		
	});

};
