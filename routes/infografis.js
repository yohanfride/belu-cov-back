"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const infografis = require('../model/infografis.model').Infografis;
const async = require('async');
const moment = require('moment-timezone');


/*
 * GET infografiss listing.
 */

exports.infografis = function(req, res){
	console.log('infografis:  list');	
	var response = Config.base_response;
	var query = {};
	infografis.getAll(query, function (err, result) {
		if(err){
			console.log('infografis: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('infografis: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the infografis*/
exports.save = function(req,res){    	
	console.log('infografis: save');	
	var response = Config.base_response;	
	var input = JSON.parse(JSON.stringify(req.body));	
	var query = input;
	infografis.create(query, function(err, result){
		var respon = Config.base_response;		
		if(err){
			console.log(err);
			if(err.errors.username){			
				console.log('infografis: add error:');
				respon.is_success = false;
				respon.description = 'username is exists';
				respon.data = 'Failed';
			} else if(err.errors.email){			
				console.log('infografis: add error:');
				respon.is_success = false;
				respon.description = 'email is exists';
				respon.data = 'Failed';
			} else {
				console.log('infografis: add err:', err);
				respon.is_success = false;
				respon.description = 'Failed';
				respon.data = err;
			}
		} else {			
			console.log('infografis: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

//infografis Get by username
exports.infografis_detail = function(req, res){
	console.log('infografis: infografis list');
	var id = req.params.id;  	
	var response = Config.base_response;
	var query = {_id:id};	
	infografis.get(query,function(err, result){
		if(!result){
			console.log('infografis: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('infografis: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

exports.search = function(req, res){
	console.log('infografis: infografis search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	infografis.getAll(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('infografis: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('infografis: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

exports.search_count = function(req, res){
	console.log('infografis: infografis count');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	infografis.getCount(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('infografis: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('infografis: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

exports.edit_infografis = function(req,res){    	
	var response = Config.base_response;
	console.log('infografis: edit');	
	var id = req.params.id;  	
	var query = JSON.parse(JSON.stringify(req.body));
	infografis.updateById({_id:id},query, function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('infografis: edit err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			console.log('infografis: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';
		}
		res.json(response);		
	});	
};

/*Delete the infografis*/
exports.delete_infografis = function(req,res){
    var id = req.params.id;
    var response = Config.base_response;
	console.log('infografis: delete');
	var query = {_id:id};
	infografis.removeById(query,function(err, result){
		if(err){
			console.log('infografis: delete err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
		} else {
			if(!result.n){
				console.log('infografis: delete err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;
			}else{
				console.log('infografis: delete succ:');
				response.is_success = true;
				response.description = 'success';
				response.data = 'success';	
			}
		}
		res.json(response);		
	});

};
