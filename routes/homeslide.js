"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const homeslide = require('../model/homeslide.model').Homeslide;
const async = require('async');
const moment = require('moment-timezone');


/*
 * GET homeslides listing.
 */

exports.homeslide = function(req, res){
	console.log('homeslide:  list');	
	var response = Config.base_response;
	var query = {};
	homeslide.getAll(query, function (err, result) {
		if(err){
			console.log('homeslide: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('homeslide: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the homeslide*/
exports.save = function(req,res){    	
	console.log('homeslide: save');	
	var response = Config.base_response;	
	var input = JSON.parse(JSON.stringify(req.body));	
	var query = input;
	homeslide.create(query, function(err, result){
		var respon = Config.base_response;		
		if(err){
			console.log(err);
			if(err.errors.username){			
				console.log('homeslide: add error:');
				respon.is_success = false;
				respon.description = 'username is exists';
				respon.data = 'Failed';
			} else if(err.errors.email){			
				console.log('homeslide: add error:');
				respon.is_success = false;
				respon.description = 'email is exists';
				respon.data = 'Failed';
			} else {
				console.log('homeslide: add err:', err);
				respon.is_success = false;
				respon.description = 'Failed';
				respon.data = err;
			}
		} else {			
			console.log('homeslide: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

//homeslide Get by username
exports.homeslide_detail = function(req, res){
	console.log('homeslide: homeslide list');
	var id = req.params.id;  	
	var response = Config.base_response;
	var query = {_id:id};	
	homeslide.get(query,function(err, result){
		if(!result){
			console.log('homeslide: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('homeslide: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

exports.search = function(req, res){
	console.log('homeslide: homeslide search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	homeslide.getAll(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('homeslide: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('homeslide: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

exports.search_count = function(req, res){
	console.log('homeslide: homeslide count');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	homeslide.getCount(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('homeslide: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('homeslide: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

exports.edit_homeslide = function(req,res){    	
	var response = Config.base_response;
	console.log('homeslide: edit');	
	var id = req.params.id;  	
	var query = JSON.parse(JSON.stringify(req.body));
	homeslide.updateById({_id:id},query, function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('homeslide: edit err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			console.log('homeslide: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';
		}
		res.json(response);		
	});	
};

/*Delete the homeslide*/
exports.delete_homeslide = function(req,res){
    var id = req.params.id;
    var response = Config.base_response;
	console.log('homeslide: delete');
	var query = {_id:id};
	homeslide.removeById(query,function(err, result){
		if(err){
			console.log('homeslide: delete err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
		} else {
			if(!result.n){
				console.log('homeslide: delete err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;
			}else{
				console.log('homeslide: delete succ:');
				response.is_success = true;
				response.description = 'success';
				response.data = 'success';	
			}
		}
		res.json(response);		
	});

};
