"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const Tes = require('../model/tes.model').Tes;
const Log = require('../model/log.model').Log;
const async = require('async');
const moment = require('moment-timezone');
const daily = require('./daily');


/*
 * GET tess listing.
 */

exports.tes = function(req, res){
	console.log('tes:  list');	
	var response = Config.base_response;
	var query = {};
	Tes.getAll(query, function (err, result) {
		if(err){
			console.log('tes: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('tes: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the tes*/
exports.save = function(req,res){    	
	console.log('tes: save');	
	var response = Config.base_response;	
	var input = JSON.parse(JSON.stringify(req.body));
    if( input.loc_long && input.loc_lat ){
    	input.lokasi = { type: 'Point', coordinates: [input.loc_long, input.loc_lat] };   	
    }
    if(!input.date_add){
    	input.date_add = moment.utc().local().format('YYYY-MM-DDTHH:mm:ss')+".000Z"; //new Date();
    	input.date_updated = moment.utc().local().format('YYYY-MM-DDTHH:mm:ss')+".000Z"; //new Date();
    }
    var query = input;
	Tes.create(query, function(err, result){
		var respon = Config.base_response;		
		if(err){
			console.log('tes: add err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			daily.new();
			console.log('tes: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

//Tes Get by Tesname
exports.tes_detail = function(req, res){
	console.log('tes: tes list');
	var id = req.params.id;  	
	var response = Config.base_response;
	var query = {_id:id};	
	Tes.get(query,function(err, result){
		if(!result){
			console.log('tes: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('tes: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


///Activation Tes
exports.search = function(req, res){
	console.log('tes: tes search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.nama)
		input.nama = { '$regex' : input.nama, '$options' : 'i' }

	if(input.str_date && input.end_date){
		input.date_add = { $gte: new Date(input.str_date+"T00:00:00.000Z"), $lte:  new Date(input.end_date+"T23:59:59.000Z") };
		delete input.str_date;
		delete input.end_date;
	}

	if(input.tes_str_date && input.tes_end_date){
		input.tgl_tes = { $gte: new Date(input.str_date+"T00:00:00.000Z"), $lte:  new Date(input.end_date+"T23:59:59.000Z") };
		delete input.tgl_tes;
	}

	var query = input;
	Tes.getAll(query,function(err, result){		
		console.log(err);
		console.log(result);
		if(!result){
			console.log('tes: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('tes: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

///Activation Tes
exports.searchRadius = function(req, res){
	console.log('tes: tes search radius');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if( input.current_long && input.current_lat ){
		if(!input.distance) input.distance = 1000;
		Tes.getCor(input.current_long,input.current_lat,input.distance,function(err, result){		
			console.log(result);
			if(!result){
				console.log('tes: search err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;			
			} else {
				console.log('tes: search succ:', result);			
				response.is_success = true;
				response.description = 'success';
				response.data = result;			
			}
			res.json(response);		
		});	
    } else {
    	console.log('tes: search err:', err);
		response.is_success = false;
		response.description = 'Failed';
		response.data = "Missing Parameter";
    }	
};


///Activation Tes
exports.search_count = function(req, res){
	console.log('tes: tes count');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.nama)
		input.nama = { '$regex' : input.nama, '$options' : 'i' }
	
	if(input.str_date && input.end_date){
		input.date_add = { $gte: new Date(input.str_date+"T00:00:00.000Z"), $lte:  new Date(input.end_date+"T23:59:59.000Z") };
		delete input.str_date;
		delete input.end_date;
	}
	
	var query = input;		
	console.log(query);
	Tes.getCount(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('tes: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('tes: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the tes*/
exports.edit_tes = function(req,res){    	
	var response = Config.base_response;
	console.log('tes: edit');	
	var id = req.params.id;  	
	var query = JSON.parse(JSON.stringify(req.body));
	var qrcode = 0;
	if(query.qrcode ){
		qrcode = query.qrcode;
	}
	if( query.loc_long && query.loc_lat ){
    	query.lokasi = { type: 'Point', coordinates: [query.loc_long, query.loc_lat] };   	
    }	
  if(!query.date_updated ){
    	query.date_updated = moment.utc().local().format('YYYY-MM-DDTHH:mm:ss')+".000Z"; //new Date();   		
    }
	Tes.updateById({_id:id},query, function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('tes: edit err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			if(qrcode ){
				QRCode.updateById({qrcode:qrcode},{active:1}, function(err, result){});	
			}
			daily.new();
			console.log('tes: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';
		}
		res.json(response);		
	});	
};

/*Delete the tes*/
exports.delete_tes = function(req,res){
    var id = req.params.id;
    var response = Config.base_response;
	console.log('tes: delete');
	var query = {_id:id};
	Tes.removeById(query,function(err, result){
		console.log(result);
		if(err){
			console.log('tes: delete err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
		} else {
			if(!result.n){
				console.log('tes: delete err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;		
			} else {
				console.log('tes: delete succ:');
				daily.new();
				response.is_success = true;
				response.description = 'success';
				response.data = 'success';		
			}
		}
		res.json(response);		
	});

};

exports.search_all = function(req, res){
	console.log('tes: tes search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	Tes.getAll(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('tes: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('tes: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

