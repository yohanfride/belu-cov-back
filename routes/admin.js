"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const admin = require('../model/admin.model').Admin;
const async = require('async');
const moment = require('moment-timezone');


/*
 * GET admins listing.
 */

exports.admin = function(req, res){
	console.log('admin:  list');	
	var response = Config.base_response;
	var query = {};
	admin.getAll(query, function (err, result) {
		if(err){
			console.log('admin: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('admin: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the admin*/
exports.save = function(req,res){    	
	console.log('admin: save');	
	var response = Config.base_response;	
	var input = JSON.parse(JSON.stringify(req.body));	
	input.username = input.username.toLowerCase();
    input.password = Common.encrypt(input.password); 
    var query = input;
	admin.create(query, function(err, result){
		var respon = Config.base_response;		
		if(err){
			console.log(err);
			if(err.errors.username){			
				console.log('admin: add error:');
				respon.is_success = false;
				respon.description = 'username is exists';
				respon.data = 'Failed';
			} else if(err.errors.email){			
				console.log('admin: add error:');
				respon.is_success = false;
				respon.description = 'email is exists';
				respon.data = 'Failed';
			} else {
				console.log('admin: add err:', err);
				respon.is_success = false;
				respon.description = 'Failed';
				respon.data = err;
			}
		} else {			
			console.log('admin: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(respon);		
	});	
};

//admin Get by username
exports.admin_detail = function(req, res){
	console.log('admin: admin list');
	var id = req.params.id;  	
	var response = Config.base_response;
	var query = {_id:id};	
	admin.get(query,function(err, result){
		if(!result){
			console.log('admin: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('admin: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

///Activation admin
exports.admin_activation = function(req, res){
	console.log('admin: admin activation');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;	
	var query2 = {active:1};
	admin.updateById(query,query2,function(err, result){		
		console.log(result);
		if(!result.n){
			console.log('admin: activation err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('admin: activation succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

///Activation admin
exports.search = function(req, res){
	console.log('admin: admin search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	admin.getAll(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('admin: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('admin: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

///Activation admin
exports.search_count = function(req, res){
	console.log('admin: admin count');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	admin.getCount(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('admin: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('admin: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the admin*/
exports.edit_admin = function(req,res){    	
	var response = Config.base_response;
	console.log('admin: edit');	
	var id = req.params.id;  	
	var query = JSON.parse(JSON.stringify(req.body));
	if( query.loc_long && query.loc_lat ){
    	query.lokasi = { type: 'Point', coordinates: [query.loc_long, query.loc_lat] };   	
    }	
	admin.updateById({_id:id},query, function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('admin: edit err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			console.log('admin: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';
		}
		res.json(response);		
	});	
};

/*Save the admin*/
exports.change_status = function(req,res){    	
	var response = Config.base_response;
	console.log('admin: change_status');	
	var id = req.params.id;  	
	var status = req.params.status; 
	var query = { active:status };
	admin.updateById({_id : id},query,function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('admin: change_status err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			console.log('admin: change_status succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

/*Save the admin*/
exports.edit_pass_admin = function(req,res){    	
	var response = Config.base_response;
	console.log('admin: edit_pass_admin');	
  	var id = req.params.id;
	var input = JSON.parse(JSON.stringify(req.body));	
    var password = Common.encrypt(input.pass);
    var password_old = Common.encrypt(input.pass_old);    
    var query = { _id:id };
    var query2 = { password:password }
    admin.get(query,function(err, result){	
    	console.log(result);
    	console.log(password_old);
		if(result.password === password_old){						
			admin.updateById(query,query2, function(err, result){
				var respon = Config.base_response;				
				if(!err){
					console.log('admin: edit_pass_admin password succ:');
					respon.is_success = true;
					respon.description = 'success';
					respon.data = 'success';
				} else {					
					console.log('admin: edit_pass_admin password err:');
					respon.is_success = false;
					respon.description = 'Failed';
					respon.data = 'Failed';
				}
				res.json(response);		
			});	
		} else {
			console.log('admin: password not match');
			response.is_success = false;
			response.description = 'Failed';
			response.data = 'password not match';
			res.json(response);	
		}		
	});		
};

exports.reset_pass_admin = function(req,res){    	
	var response = Config.base_response;
	console.log('admin: reset_pass_admin');	
  	var id = req.params.id;
	var input = JSON.parse(JSON.stringify(req.body));	
    var password = Common.encrypt(input.pass);    
    var query = { _id:id };
    var query2 = { password:password }
   	admin.updateById(query,query2, function(err, result){
		var respon = Config.base_response;				
		if(!err){
			console.log(result);
			if(!result.n){
				console.log('admin: reset_pass_admin password err:');
				respon.is_success = false;
				respon.description = 'Failed';
				respon.data = 'Failed';			
			} else {
				console.log('admin: reset_pass_admin password succ:');
				respon.is_success = true;
				respon.description = 'success';
				respon.data = 'success';		
			}
		} else {	

			console.log('admin: reset_pass_admin password err:');
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
	console.log('admin: login');	
  	console.log(req.body);  	
	var input = JSON.parse(JSON.stringify(req.body));	
    var password = Common.encrypt(input.pass);   
    var username = input.username;
    var query = { username:username, password:password }
    admin.get(query, function(err, result){		    	    					
		if(!result){
			console.log('admin: username and Password failed ');
			response.is_success = false;
			response.description = 'Failed';
			response.data = 'your username and password wrong, try again';
			res.json(response);	
		} else {
			
			if(result.active == 1){
				console.log('admin: login');
				response.is_success = true;
				response.description = 'Success';
				response.data = result;
				res.json(response);	
			} else {
				console.log('admin: login account not active');
				response.is_success = false;
				response.description = 'Failed';
				response.data = 'your account is not active';
				res.json(response);	
			} 			
		}
	});			
};

/*Delete the admin*/
exports.delete_admin = function(req,res){
    var id = req.params.id;
    var response = Config.base_response;
	console.log('admin: delete');
	var query = {_id:id};
	admin.removeById(query,function(err, result){
		if(err){
			console.log('admin: delete err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
		} else {
			if(!result.n){
				console.log('admin: delete err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;
			}else{
				console.log('admin: delete succ:');
				response.is_success = true;
				response.description = 'success';
				response.data = 'success';	
			}
		}
		res.json(response);		
	});

};

exports.search_all = function(req, res){
	console.log('admin: admin search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	admin.getAll(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('admin: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('admin: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};