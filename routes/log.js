"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const Log = require('../model/log.model').Log;
const async = require('async');
const moment = require('moment-timezone');
const qr = require('qr-image');
const fs = require('fs');
const path = require('path');

/*
 * GET logss listing.
 */

exports.logs = function(req, res){
	console.log('logs:  list');	
	var response = Config.base_response;
	var query = {};
	Log.getAll(query, function (err, result) {
		if(err){
			console.log('logs: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('logs: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

//Log Get by Logname
exports.logs_detail = function(req, res){
	console.log('logs: logs list');
	var id = req.params.id;  	
	var response = Config.base_response;
	var query = {_id:id};	
	Log.get(query,function(err, result){
		if(!result){
			console.log('logs: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('logs: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

///Activation Log
exports.search = function(req, res){
	console.log('logs: logs search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.str_date && input.end_date){
		input.date_add = { $gte: new Date(input.str_date+"T00:00:00.000Z"), $lte:  new Date(input.end_date+"T23:59:59.000Z") };
		delete input.str_date;
		delete input.end_date;
	}
	if(input.nama)
		input.nama = { '$regex' : input.nama, '$options' : 'i' }

	if(input.sort == 'id'){
		input.sort = { _id : input.sortby };
	} else if(input.sort == 'date_add'){
		input.sort = { date_add : input.sortby };
	} else if(input.sort == 'date_updated'){
		input.sort = { date_updated : input.sortby };
	} else {
		delete input.sort;
	}

	var query = input;
	console.log(query);
	Log.getAll(query,function(err, result){		
		console.log(err);
		console.log(result);
		if(!result){
			console.log('logs: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('logs: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


///Activation Log
exports.search_count = function(req, res){
	console.log('logs: logs count');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.str_date && input.end_date){
		input.date_add = { $gte: new Date(input.str_date+"T00:00:00.000Z"), $lte:  new Date(input.end_date+"T23:59:59.000Z") };
		delete input.str_date;
		delete input.end_date;
	}
	if(input.nama)
		input.nama = { '$regex' : input.nama, '$options' : 'i' }
	
	var query = input;		
	console.log(query);
	Log.getCount(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('logs: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('logs: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};