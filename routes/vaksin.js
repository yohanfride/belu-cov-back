"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const Vaksin = require('../model/vaksin.model').Vaksin;
const Log = require('../model/log.model').Log;
const async = require('async');
const moment = require('moment-timezone');
const daily = require('./daily');


/*
 * GET vaksins listing.
 */

exports.vaksin = function(req, res){
	console.log('vaksin:  list');	
	var response = Config.base_response;
	var query = {};
	Vaksin.getAll(query, function (err, result) {
		if(err){
			console.log('vaksin: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('vaksin: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the vaksin*/
exports.save = function(req,res){    	
	console.log('vaksin: save');	
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
	Vaksin.create(query, function(err, result){
		var respon = Config.base_response;		
		if(err){
			console.log('vaksin: add err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			daily.new();
			console.log('vaksin: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

//Vaksin Get by Vaksinname
exports.vaksin_detail = function(req, res){
	console.log('vaksin: vaksin list');
	var id = req.params.id;  	
	var response = Config.base_response;
	var query = {_id:id};	
	Vaksin.get(query,function(err, result){
		if(!result){
			console.log('vaksin: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('vaksin: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


///Activation Vaksin
exports.search = function(req, res){
	console.log('vaksin: vaksin search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.nama)
		input.nama = { '$regex' : input.nama, '$options' : 'i' }

	if(input.str_date && input.end_date){
		input.date_add = { $gte: new Date(input.str_date+"T00:00:00.000Z"), $lte:  new Date(input.end_date+"T23:59:59.000Z") };
		delete input.str_date;
		delete input.end_date;
	}

	if(input.vaksin_str_date && input.vaksin_end_date){
		var tgl_vaksinasi1 = { $gte: new Date(input.str_date+"T00:00:00.000Z"), $lte:  new Date(input.end_date+"T23:59:59.000Z") };
		var tgl_vaksinasi2 = { $gte: new Date(input.str_date+"T00:00:00.000Z"), $lte:  new Date(input.end_date+"T23:59:59.000Z") };
		input.$or = [{tgl_vaksinasi1:tgl_vaksinasi1},{tgl_vaksinasi2:tgl_vaksinasi2}];
		delete input.vaksin_str_date;
		delete input.vaksin_end_date;
	}

	var query = input;
	Vaksin.getAll(query,function(err, result){		
		console.log(err);
		console.log(result);
		if(!result){
			console.log('vaksin: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('vaksin: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

///Activation Vaksin
exports.searchRadius = function(req, res){
	console.log('vaksin: vaksin search radius');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if( input.current_long && input.current_lat ){
		if(!input.distance) input.distance = 1000;
		Vaksin.getCor(input.current_long,input.current_lat,input.distance,function(err, result){		
			console.log(result);
			if(!result){
				console.log('vaksin: search err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;			
			} else {
				console.log('vaksin: search succ:', result);			
				response.is_success = true;
				response.description = 'success';
				response.data = result;			
			}
			res.json(response);		
		});	
    } else {
    	console.log('vaksin: search err:', err);
		response.is_success = false;
		response.description = 'Failed';
		response.data = "Missing Parameter";
    }	
};


///Activation Vaksin
exports.search_count = function(req, res){
	console.log('vaksin: vaksin count');
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
	Vaksin.getCount(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('vaksin: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('vaksin: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the vaksin*/
exports.edit_vaksin = function(req,res){    	
	var response = Config.base_response;
	console.log('vaksin: edit');	
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
	Vaksin.updateById({_id:id},query, function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('vaksin: edit err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			if(qrcode ){
				QRCode.updateById({qrcode:qrcode},{active:1}, function(err, result){});	
			}
			daily.new();
			console.log('vaksin: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';
		}
		res.json(response);		
	});	
};

/*Delete the vaksin*/
exports.delete_vaksin = function(req,res){
    var id = req.params.id;
    var response = Config.base_response;
	console.log('vaksin: delete');
	var query = {_id:id};
	Vaksin.removeById(query,function(err, result){
		console.log(result);
		if(err){
			console.log('vaksin: delete err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
		} else {
			if(!result.n){
				console.log('vaksin: delete err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;		
			} else {
				console.log('vaksin: delete succ:');
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
	console.log('vaksin: vaksin search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	Vaksin.getAll(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('vaksin: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('vaksin: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

