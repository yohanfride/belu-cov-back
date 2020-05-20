"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const Faskes = require('../model/rumahisolasi.model').RumahIsolasi;
const async = require('async');
const moment = require('moment-timezone');


/*
 * GET rumahisolasis listing.
 */

exports.rumahisolasi = function(req, res){
	console.log('rumahisolasi:  list');	
	var response = Config.base_response;
	Faskes.getAll({}, function (err, result) {
		if(err){
			console.log('rumahisolasi: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('rumahisolasi: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the rumahisolasi*/
exports.save = function(req,res){    	
	console.log('rumahisolasi: save');	
	var response = Config.base_response;	
	var input = JSON.parse(JSON.stringify(req.body));
    if( input.loc_long && input.loc_lat ){
    	input.lokasi = { type: 'Point', coordinates: [input.loc_long, input.loc_lat] };   	
    }
    var query = input;
    
	Faskes.create(query, function(err, result){
		var respon = Config.base_response;		
		if(err){
			console.log('rumahisolasi: add err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			console.log('rumahisolasi: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});		
};

//Faskes Get by Faskesname
exports.rumahisolasi_detail = function(req, res){
	console.log('rumahisolasi: rumahisolasi list');
	var id = req.params.id;  	
	var response = Config.base_response;
	var query = {_id:id};	
	Faskes.get(query,function(err, result){
		if(!result){
			console.log('rumahisolasi: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('rumahisolasi: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


///Activation Faskes
exports.search = function(req, res){
	console.log('rumahisolasi: rumahisolasi search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.nama)
		input.nama = { '$regex' : input.nama, '$options' : 'i' }
	var query = input;
	Faskes.getAll(query,function(err, result){		
		
		if(!result){
			console.log('rumahisolasi: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('rumahisolasi: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

///Activation Faskes
exports.searchRadius = function(req, res){
	console.log('rumahisolasi: rumahisolasi search radius');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if( input.current_long && input.current_lat ){
		if(!input.distance) input.distance = 1000;
		Faskes.getCor(input.current_long,input.current_lat,input.distance,function(err, result){		
			console.log(result);
			if(!result){
				console.log('rumahisolasi: search err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;			
			} else {
				console.log('rumahisolasi: search succ:', result);			
				response.is_success = true;
				response.description = 'success';
				response.data = result;			
			}
			res.json(response);		
		});	
    } else {
    	console.log('rumahisolasi: search err:', err);
		response.is_success = false;
		response.description = 'Failed';
		response.data = "Missing Parameter";
    }	
};


///Activation Faskes
exports.search_count = function(req, res){
	console.log('rumahisolasi: rumahisolasi count');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.nama)
		input.nama = { '$regex' : input.nama, '$options' : 'i' }
	var query = input;		
	console.log(query);
	Faskes.getCount(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('rumahisolasi: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('rumahisolasi: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the rumahisolasi*/
exports.edit_rumahisolasi = function(req,res){    	
	var response = Config.base_response;
	console.log('rumahisolasi: edit');	
	var id = req.params.id;  	
	var query = JSON.parse(JSON.stringify(req.body));
	if( query.loc_long && query.loc_lat ){
    	query.lokasi = { type: 'Point', coordinates: [query.loc_long, query.loc_lat] };   	
    }	
	Faskes.updateById({_id:id},query, function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('rumahisolasi: edit err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			console.log('rumahisolasi: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';
		}
		res.json(response);		
	});	
};


/*Delete the rumahisolasi*/
exports.delete_rumahisolasi = function(req,res){
    var id = req.params.id;
    var response = Config.base_response;
	console.log('rumahisolasi: devare');
	var query = {_id:id};
	Faskes.removeById(query,function(err, result){
		console.log(result);
		if(err){
			console.log('rumahisolasi: devare err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
		} else {
			if(!result.n){
				console.log('rumahisolasi: devare err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;		
			} else {
				console.log('rumahisolasi: devare succ:');
				response.is_success = true;
				response.description = 'success';
				response.data = 'success';		
			}
			
		}
		res.json(response);		
	});

};
