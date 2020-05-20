"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const video = require('../model/video.model').Video;
const async = require('async');
const moment = require('moment-timezone');


/*
 * GET videos listing.
 */

exports.video = function(req, res){
	console.log('video:  list');	
	var response = Config.base_response;
	var query = {};
	video.getAll(query, function (err, result) {
		if(err){
			console.log('video: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('video: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the video*/
exports.save = function(req,res){    	
	console.log('video: save');	
	var response = Config.base_response;	
	var input = JSON.parse(JSON.stringify(req.body));	
	var query = input;
	video.create(query, function(err, result){
		var respon = Config.base_response;		
		if(err){
			console.log(err);
			if(err.errors.username){			
				console.log('video: add error:');
				respon.is_success = false;
				respon.description = 'username is exists';
				respon.data = 'Failed';
			} else if(err.errors.email){			
				console.log('video: add error:');
				respon.is_success = false;
				respon.description = 'email is exists';
				respon.data = 'Failed';
			} else {
				console.log('video: add err:', err);
				respon.is_success = false;
				respon.description = 'Failed';
				respon.data = err;
			}
		} else {			
			console.log('video: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

//video Get by username
exports.video_detail = function(req, res){
	console.log('video: video list');
	var id = req.params.id;  	
	var response = Config.base_response;
	var query = {_id:id};	
	video.get(query,function(err, result){
		if(!result){
			console.log('video: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('video: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

exports.search = function(req, res){
	console.log('video: video search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	video.getAll(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('video: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('video: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

exports.search_count = function(req, res){
	console.log('video: video count');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	video.getCount(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('video: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('video: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

exports.edit_video = function(req,res){    	
	var response = Config.base_response;
	console.log('video: edit');	
	var id = req.params.id;  	
	var query = JSON.parse(JSON.stringify(req.body));
	video.updateById({_id:id},query, function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('video: edit err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			console.log('video: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';
		}
		res.json(response);		
	});	
};

/*Delete the video*/
exports.delete_video = function(req,res){
    var id = req.params.id;
    var response = Config.base_response;
	console.log('video: delete');
	var query = {_id:id};
	video.removeById(query,function(err, result){
		if(err){
			console.log('video: delete err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
		} else {
			if(!result.n){
				console.log('video: delete err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;
			}else{
				console.log('video: delete succ:');
				response.is_success = true;
				response.description = 'success';
				response.data = 'success';	
			}
		}
		res.json(response);		
	});

};
