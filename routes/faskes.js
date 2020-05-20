"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const Faskes = require('../model/faskes.model').Faskes;
const async = require('async');
const moment = require('moment-timezone');


/*
 * GET faskess listing.
 */

exports.faskes = function(req, res){
	console.log('faskes:  list');	
	var response = Config.base_response;
	Faskes.getAll({}, function (err, result) {
		if(err){
			console.log('faskes: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('faskes: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the faskes*/
exports.save = function(req,res){    	
	console.log('faskes: save');	
	var response = Config.base_response;	
	var input = JSON.parse(JSON.stringify(req.body));
    if( input.loc_long && input.loc_lat ){
    	input.lokasi = { type: 'Point', coordinates: [input.loc_long, input.loc_lat] };   	
    }
    var query = input;
    
	Faskes.create(query, function(err, result){
		var respon = Config.base_response;		
		if(err){
			console.log('faskes: add err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			console.log('faskes: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});		
};

//Faskes Get by Faskesname
exports.faskes_detail = function(req, res){
	console.log('faskes: faskes list');
	var id = req.params.id;  	
	var response = Config.base_response;
	var query = {_id:id};	
	Faskes.get(query,function(err, result){
		if(!result){
			console.log('faskes: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('faskes: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


///Activation Faskes
exports.search = function(req, res){
	console.log('faskes: faskes search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.nama)
		input.nama = { '$regex' : input.nama, '$options' : 'i' }
	var query = input;
	Faskes.getAll(query,function(err, result){		
		
		if(!result){
			console.log('faskes: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('faskes: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

///Activation Faskes
exports.searchRadius = function(req, res){
	console.log('faskes: faskes search radius');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if( input.current_long && input.current_lat ){
		if(!input.distance) input.distance = 1000;
		Faskes.getCor(input.current_long,input.current_lat,input.distance,function(err, result){		
			console.log(result);
			if(!result){
				console.log('faskes: search err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;			
			} else {
				console.log('faskes: search succ:', result);			
				response.is_success = true;
				response.description = 'success';
				response.data = result;			
			}
			res.json(response);		
		});	
    } else {
    	console.log('faskes: search err:', err);
		response.is_success = false;
		response.description = 'Failed';
		response.data = "Missing Parameter";
    }	
};


///Activation Faskes
exports.search_count = function(req, res){
	console.log('faskes: faskes count');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.nama)
		input.nama = { '$regex' : input.nama, '$options' : 'i' }
	var query = input;		
	console.log(query);
	Faskes.getCount(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('faskes: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('faskes: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the faskes*/
exports.edit_faskes = function(req,res){    	
	var response = Config.base_response;
	console.log('faskes: edit');	
	var id = req.params.id;  	
	var query = JSON.parse(JSON.stringify(req.body));
	if( query.loc_long && query.loc_lat ){
    	query.lokasi = { type: 'Point', coordinates: [query.loc_long, query.loc_lat] };   	
    }	
	Faskes.updateById({_id:id},query, function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('faskes: edit err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			console.log('faskes: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';
		}
		res.json(response);		
	});	
};


/*Delete the faskes*/
exports.delete_faskes = function(req,res){
    var id = req.params.id;
    var response = Config.base_response;
	console.log('faskes: devare');
	var query = {_id:id};
	Faskes.removeById(query,function(err, result){
		console.log(result);
		if(err){
			console.log('faskes: devare err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
		} else {
			if(!result.n){
				console.log('faskes: devare err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;		
			} else {
				console.log('faskes: devare succ:');
				response.is_success = true;
				response.description = 'success';
				response.data = 'success';		
			}
			
		}
		res.json(response);		
	});

};
