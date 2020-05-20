"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const QRCode = require('../model/qrcode.model').QRCode;
const async = require('async');
const moment = require('moment-timezone');
const qr = require('qr-image');
const fs = require('fs');
const path = require('path');

/*
 * GET qrcodes listing.
 */

exports.qrcode = function(req, res){
	console.log('qrcode:  list');	
	var response = Config.base_response;
	var query = {};
	QRCode.getAll(query, function (err, result) {
		if(err){
			console.log('qrcode: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('qrcode: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the qrcode*/
exports.save = function(req,res){    	
	console.log('qrcode: save');	
	var response = Config.base_response;	
	var input = JSON.parse(JSON.stringify(req.body));
    if(!input.link ){
    	console.log('qrcode: add err:', err);
		respon.is_success = false;
		respon.description = 'Failed';
		respon.data = "Missing Parameter";
    	res.json(response);
    } else {
    	if(!input.qrcode) input.qrcode = Math.random().toString(36).substring(7) + new Date().getTime();
    	// Get the text to generate QR code
	    var qr_txt = input.link+"/"+ input.qrcode;   
	    // Generate QR Code from text
	    var qr_png = qr.imageSync(qr_txt,{ type: 'png'})
	    // Generate a random file name 
	    var r = Math.random().toString(36).substring(5);
	    var qr_code_file_name = new Date().getTime() +'-'+r+'.png';
	    
	    fs.writeFileSync(path.join(__dirname, '../public/qr/' + qr_code_file_name), qr_png, (err) => {	        
	        if(err){
	            console.log(err);
	        }	        
	    });
	    input.filename = qr_code_file_name;
	    var query = input;
	    console.log(query);
    	QRCode.create(query, function(err, result){
			var respon = Config.base_response;		
			if(err){
				console.log('qrcode: add err:', err);
				respon.is_success = false;
				respon.description = 'Failed';
				respon.data = err;
			} else {
				//TAMBAHKAN CODE UPDATE QRCODE//
				console.log('qrcode: add succ:');
				respon.is_success = true;
				respon.description = 'success';
				respon.data = 'success';			
			}
			res.json(response);		
		});	
    }
		
};

/*Save the qrcode*/
exports.save_multi = function(req,res){    	
	console.log('qrcode: save');	
	var response = Config.base_response;	
	var input = JSON.parse(JSON.stringify(req.body));	
	var query = [];
	for (var i = 0; i < input.total; i++) {
	  	var qrcode = Math.random().toString(36).substring(7) + new Date().getTime();
    	// Get the text to generate QR code
	    var qr_txt = input.link+"/"+ qrcode;   
	    // Generate QR Code from text
	    var qr_png = qr.imageSync(qr_txt,{ type: 'png'})
	    // Generate a random file name 
	    var r = Math.random().toString(36).substring(5);
	    var qr_code_file_name = new Date().getTime() +'-'+r+'.png';
	    fs.writeFileSync(path.join(__dirname, '../public/qr/' + qr_code_file_name), qr_png, (err) => {	        
	        if(err){
	            console.log(err);
	        }	        
	    });
	    query[i] = {};
	    query[i].filename = qr_code_file_name;
	    query[i].qrcode = qrcode;
	    query[i].link = input.link;
	}
	QRCode.saveAll(query, function(err, result){
		var respon = Config.base_response;		
		if(err){
			console.log('qrcode: add err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {			
			console.log('qrcode: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};


//QRCode Get by QRCodename
exports.qrcode_detail = function(req, res){
	console.log('qrcode: qrcode list');
	var id = req.params.id;  	
	var response = Config.base_response;
	var query = {_id:id};	
	QRCode.get(query,function(err, result){
		if(!result){
			console.log('qrcode: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('qrcode: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


///Activation QRCode
exports.search = function(req, res){
	console.log('qrcode: qrcode search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	
	if(input.sort){
		var sortby = 1;
		if(input.sortby) sortby = input.sortby;
		if(input.sort == 'id'){
			input.sort = { _id : sortby };
		} else if(input.sort == 'date_add'){
			input.sort = { date_add : sortby };
		} else if(input.sort == 'active'){
			input.sort = { active : sortby };
		} else {
			delete input.sort;
		} 

		delete input.sortby;
	}

	var query = input;
	QRCode.getAll(query,function(err, result){		
		console.log(err);
		console.log(result);
		if(!result){
			console.log('qrcode: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('qrcode: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


///Activation QRCode
exports.search_count = function(req, res){
	console.log('qrcode: qrcode count');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	QRCode.getCount(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('qrcode: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('qrcode: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the qrcode*/
exports.edit_qrcode = function(req,res){    	
	var response = Config.base_response;
	console.log('qrcode: edit');	
	var id = req.params.id;  	
	var query = JSON.parse(JSON.stringify(req.body));	
	QRCode.updateById({_id:id},query, function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('qrcode: edit err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			console.log('qrcode: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';
		}
		res.json(response);		
	});	
};

/*Delete the qrcode*/
exports.delete_qrcode = function(req,res){
    var id = req.params.id;
    var response = Config.base_response;
	console.log('qrcode: delete');
	var query = {_id:id};
	QRCode.get(query, function (err, result) {
		if(err){
			console.log('qrcode: delete err:', err);
			response.is_success = false;
			response.description = 'Data Not Found';
			response.data = err;
			res.json(response);			
		} else {
			if(result.active == 1){
				console.log('qrcode: delete err:', err);
				response.is_success = false;
				response.description = 'QR Code used';
				response.data = err;
				res.json(response);	
			} else {
				QRCode.removeById(query,function(err, result){
					console.log(result);
					if(err){
						console.log('qrcode: delete err:', err);
						response.is_success = false;
						response.description = 'Failed';
						response.data = err;
					} else {
						if(!result.n){
							console.log('qrcode: delete err:', err);
							response.is_success = false;
							response.description = 'Failed';
							response.data = err;		
						} else {
							console.log('qrcode: delete succ:');
							response.is_success = true;
							response.description = 'success';
							response.data = 'success';		
						}
					}
					res.json(response);		
				});
			}
		}
				
	});	
};

exports.search_all = function(req, res){
	console.log('qrcode: qrcode search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	QRCode.getAll(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('qrcode: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('qrcode: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};