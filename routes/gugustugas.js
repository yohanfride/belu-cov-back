"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const gugustugas = require('../model/gugustugas.model').GugusTugas;
const async = require('async');
const moment = require('moment-timezone');


/*
 * GET gugustugass listing.
 */

exports.gugustugas = function(req, res){
	console.log('gugustugas:  list');	
	var response = Config.base_response;
	var query = {};
	gugustugas.getAll(query, function (err, result) {
		if(err){
			console.log('gugustugas: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('gugustugas: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the gugustugas*/
exports.save = function(req,res){    	
	console.log('gugustugas: save');	
	var response = Config.base_response;	
	var input = JSON.parse(JSON.stringify(req.body));	
	input.username = input.username.toLowerCase();
    input.password = Common.encrypt(input.password); 
    var query = input;
	gugustugas.create(query, function(err, result){
		var respon = Config.base_response;		
		if(err){
			console.log(err);
			if(err.errors.username){			
				console.log('gugustugas: add error:');
				respon.is_success = false;
				respon.description = 'username is exists';
				respon.data = 'Failed';
			} else if(err.errors.email){			
				console.log('gugustugas: add error:');
				respon.is_success = false;
				respon.description = 'email is exists';
				respon.data = 'Failed';
			} else {
				console.log('gugustugas: add err:', err);
				respon.is_success = false;
				respon.description = 'Failed';
				respon.data = err;
			}
		} else {			
			console.log('gugustugas: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

/*Save the gugustugas*/
exports.save_multi = function(req,res){    	
	console.log('gugustugas: save');	
	var response = Config.base_response;	
	var input = JSON.parse(JSON.stringify(req.body));	
	for (var i = 0; i < input.length; i++) {
	  	input[i].username = input[i].username.toLowerCase();
    	input[i].password = Common.encrypt(input[i].password); 
	}
	
    var query = input;
	gugustugas.saveAll(query, function(err, result){
		var respon = Config.base_response;		
		if(err){
			console.log(err);
			if(err.errors.username){			
				console.log('gugustugas: add error:');
				respon.is_success = false;
				respon.description = 'username is exists';
				respon.data = 'Failed';
			} else if(err.errors.email){			
				console.log('gugustugas: add error:');
				respon.is_success = false;
				respon.description = 'email is exists';
				respon.data = 'Failed';
			} else {
				console.log('gugustugas: add err:', err);
				respon.is_success = false;
				respon.description = 'Failed';
				respon.data = err;
			}
		} else {			
			console.log('gugustugas: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

//gugustugas Get by username
exports.gugustugas_detail = function(req, res){
	console.log('gugustugas: gugustugas list');
	var id = req.params.id;  	
	var response = Config.base_response;
	var query = {_id:id};	
	gugustugas.get(query,function(err, result){
		if(!result){
			console.log('gugustugas: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('gugustugas: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

///Activation gugustugas
exports.gugustugas_activation = function(req, res){
	console.log('gugustugas: gugustugas activation');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;	
	var query2 = {active:1};
	gugustugas.updateById(query,query2,function(err, result){		
		console.log(result);
		if(!result.n){
			console.log('gugustugas: activation err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('gugustugas: activation succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

///Activation gugustugas
exports.search = function(req, res){
	console.log('gugustugas: gugustugas search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.username)
		input.username = { '$regex' : input.username, '$options' : 'i' }
	if(input.name)
		input.name = { '$regex' : input.name, '$options' : 'i' }
	
	var query = input;		
	console.log(query);
	gugustugas.getAll(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('gugustugas: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('gugustugas: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

///Activation gugustugas
exports.search_count = function(req, res){
	console.log('gugustugas: gugustugas count');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	gugustugas.getCount(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('gugustugas: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('gugustugas: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the gugustugas*/
exports.edit_gugustugas = function(req,res){    	
	var response = Config.base_response;
	console.log('gugustugas: edit');	
	var id = req.params.id;  	
	var query = JSON.parse(JSON.stringify(req.body));
	if( query.loc_long && query.loc_lat ){
    	query.lokasi = { type: 'Point', coordinates: [query.loc_long, query.loc_lat] };   	
    }	
	gugustugas.updateById({_id:id},query, function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('gugustugas: edit err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			console.log('gugustugas: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';
		}
		res.json(response);		
	});	
};

/*Save the gugustugas*/
exports.change_status = function(req,res){    	
	var response = Config.base_response;
	console.log('gugustugas: change_status');	
	var id = req.params.id;  	
	var status = req.params.status; 
	var query = { active:status };
	gugustugas.updateById({_id : id},query,function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('gugustugas: change_status err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			console.log('gugustugas: change_status succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

/*Save the gugustugas*/
exports.edit_pass_gugustugas = function(req,res){    	
	var response = Config.base_response;
	console.log('gugustugas: edit_pass_gugustugas');	
  	var id = req.params.id;
	var input = JSON.parse(JSON.stringify(req.body));	
    var password = Common.encrypt(input.pass);
    var password_old = Common.encrypt(input.pass_old);    
    var query = { _id:id };
    var query2 = { password:password }
    gugustugas.get(query,function(err, result){	
    	console.log(result);
    	console.log(password_old);
		if(result.password === password_old){						
			gugustugas.updateById(query,query2, function(err, result){
				var respon = Config.base_response;				
				if(!err){
					console.log('gugustugas: edit_pass_gugustugas password succ:');
					respon.is_success = true;
					respon.description = 'success';
					respon.data = 'success';
				} else {					
					console.log('gugustugas: edit_pass_gugustugas password err:');
					respon.is_success = false;
					respon.description = 'Failed';
					respon.data = 'Failed';
				}
				res.json(response);		
			});	
		} else {
			console.log('gugustugas: password not match');
			response.is_success = false;
			response.description = 'Failed';
			response.data = 'password not match';
			res.json(response);	
		}		
	});		
};

exports.reset_pass_gugustugas = function(req,res){    	
	var response = Config.base_response;
	console.log('gugustugas: reset_pass_gugustugas');	
  	var id = req.params.id;
	var input = JSON.parse(JSON.stringify(req.body));	
    var password = Common.encrypt(input.pass);    
    var query = { _id:id };
    var query2 = { password:password }
   	gugustugas.updateById(query,query2, function(err, result){
		var respon = Config.base_response;				
		if(!err){
			console.log(result);
			if(!result.n){
				console.log('gugustugas: reset_pass_gugustugas password err:');
				respon.is_success = false;
				respon.description = 'Failed';
				respon.data = 'Failed';			
			} else {
				console.log('gugustugas: reset_pass_gugustugas password succ:');
				respon.is_success = true;
				respon.description = 'success';
				respon.data = 'success';		
			}
		} else {	

			console.log('gugustugas: reset_pass_gugustugas password err:');
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = 'Failed';
		}
		res.json(response);		
	});				
};

//login

exports.login = function(req,res){    	
	var response = Config.base_response;
	console.log('gugustugas: login');	
  	console.log(req.body);  	
	var input = JSON.parse(JSON.stringify(req.body));	
    var password = Common.encrypt(input.pass);   
    var username = input.username;
    var query = { username:username, password:password }
    gugustugas.get(query, function(err, result){		    	    					
		if(!result){
			console.log('gugustugas: username and Password failed ');
			response.is_success = false;
			response.description = 'Failed';
			response.data = 'your username and password wrong, try again';
			res.json(response);	
		} else {
			
			if(result.active == 1){
				console.log('gugustugas: login');
				response.is_success = true;
				response.description = 'Success';
				response.data = result;
				res.json(response);	
			} else {
				console.log('gugustugas: login account not active');
				response.is_success = false;
				response.description = 'Failed';
				response.data = 'your account is not active';
				res.json(response);	
			} 			
		}
	});			
};

/*Delete the gugustugas*/
exports.delete_gugustugas = function(req,res){
    var id = req.params.id;
    var response = Config.base_response;
	console.log('gugustugas: delete');
	var query = {_id:id};
	gugustugas.removeById(query,function(err, result){
		if(err){
			console.log('gugustugas: delete err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
		} else {
			if(!result.n){
				console.log('gugustugas: delete err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;
			}else{
				console.log('gugustugas: delete succ:');
				response.is_success = true;
				response.description = 'success';
				response.data = 'success';	
			}
		}
		res.json(response);		
	});

};

exports.search_all = function(req, res){
	console.log('gugustugas: gugustugas search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	gugustugas.getAll(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('gugustugas: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('gugustugas: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};