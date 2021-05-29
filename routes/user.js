"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const User = require('../model/user.model').User;
const QRCode = require('../model/qrcode.model').QRCode;
const Log = require('../model/log.model').Log;
const async = require('async');
const moment = require('moment-timezone');
const daily = require('./daily');


/*
 * GET users listing.
 */

exports.user = function(req, res){
	console.log('user:  list');	
	var response = Config.base_response;
	query = {};
	User.getAll(query, function (err, result) {
		if(err){
			console.log('user: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('user: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the user*/
exports.save = function(req,res){    	
	console.log('user: save');	
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
	User.create(query, function(err, result){
		var respon = Config.base_response;		
		if(err){
			console.log('user: add err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			//TAMBAHKAN CODE UPDATE QRCODE//
			if(!input.qrcode ){
				QRCode.updateById({qrcode:input.qrcode},{active:1}, function(err, result){});	
			}
			///Code Untuk Update Rekap
			if(!input.kode_import){
				daily.new();
			}else {
				daily.import_new(input.date_add);
			}
			console.log('user: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

//User Get by Username
exports.user_detail = function(req, res){
	console.log('user: user list');
	var id = req.params.id;  	
	var response = Config.base_response;
	var query = {_id:id};	
	User.get(query,function(err, result){
		if(!result){
			console.log('user: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('user: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


///Activation User
exports.search = function(req, res){
	console.log('user: user search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.nama)
		input.nama = { '$regex' : input.nama, '$options' : 'i' }
	if(input.noqr){
		input.qrcode = '';
		delete input.noqr;
	}

	if(input.str_date && input.end_date){
		input.date_add = { $gte: new Date(input.str_date+"T00:00:00.000Z"), $lte:  new Date(input.end_date+"T23:59:59.000Z") };
		delete input.str_date;
		delete input.end_date;
	}

	var query = input;
	User.getAll(query,function(err, result){		
		console.log(err);
		console.log(result);
		if(!result){
			console.log('user: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('user: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

///Activation User
exports.searchRadius = function(req, res){
	console.log('user: user search radius');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if( input.current_long && input.current_lat ){
		if(!input.distance) input.distance = 1000;
		User.getCor(input.current_long,input.current_lat,input.distance,function(err, result){		
			console.log(result);
			if(!result){
				console.log('user: search err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;			
			} else {
				console.log('user: search succ:', result);			
				response.is_success = true;
				response.description = 'success';
				response.data = result;			
			}
			res.json(response);		
		});	
    } else {
    	console.log('user: search err:', err);
		response.is_success = false;
		response.description = 'Failed';
		response.data = "Missing Parameter";
    }	
};


///Activation User
exports.search_count = function(req, res){
	console.log('user: user count');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.nama)
		input.nama = { '$regex' : input.nama, '$options' : 'i' }

	if(input.noqr){
		input.qrcode = '';
		delete input.noqr;
	}
	
	if(input.str_date && input.end_date){
		input.date_add = { $gte: new Date(input.str_date+"T00:00:00.000Z"), $lte:  new Date(input.end_date+"T23:59:59.000Z") };
		delete input.str_date;
		delete input.end_date;
	}
	
	var query = input;		
	console.log(query);
	User.getCount(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('user: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('user: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the user*/
exports.edit_user = function(req,res){    	
	var response = Config.base_response;
	console.log('user: edit');	
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
	User.updateById({_id:id},query, function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('user: edit err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			if(qrcode ){
				QRCode.updateById({qrcode:qrcode},{active:1}, function(err, result){});	
			}
			daily.new();
			console.log('user: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';
		}
		res.json(response);		
	});	
};

/*Save the user*/
exports.edit_user_scan = function(req,res){    	
	var response = Config.base_response;
	console.log('user: edit scan');	
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
    	query.date_updated = new Date();   	
    }

	User.get({_id:id},function(err, result){
		if(!result){
			console.log('user: edit scan err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;	
			res.json(response);			
		} else {
			var old_data = result;
			User.updateById({_id:id},query, function(err, result){
				var respon = Config.base_response;
				if(err){
					console.log('user: edit scan err:', err);
					respon.is_success = false;
					respon.description = 'Failed';
					respon.data = err;
				} else {
					console.log('user: edit scan succ:');
					query.iduser = id;
					Log.create(query, function(err, result){console.log(err); console.log(result);console.log("------------------")});
					if(qrcode ){
						QRCode.updateById({qrcode:qrcode},{active:1}, function(err, result){});	
					}
					daily.new();
					respon.is_success = true;
					respon.description = 'success';
					respon.data = 'success';
				}
				res.json(response);		
			});			
		}	
	});	

};



/*Save the user*/
exports.change_status = function(req,res){    	
	var response = Config.base_response;
	console.log('user: change_status');	
	var id = req.params.id;  	
	var status = req.params.status; 
	var query = { status:status };
	User.updateById({_id : id},query,function(err, result){
		var respon = Config.base_response;
		if(err){
			console.log('user: change_status err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {
			daily.new();
			console.log('user: change_status succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
		}
		res.json(response);		
	});	
};

/*Delete the user*/
exports.delete_user = function(req,res){
    var id = req.params.id;
    var response = Config.base_response;
	console.log('user: delete');
	var query = {_id:id};
	User.removeById(query,function(err, result){
		console.log(result);
		if(err){
			console.log('user: delete err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
		} else {
			if(!result.n){
				console.log('user: delete err:', err);
				response.is_success = false;
				response.description = 'Failed';
				response.data = err;		
			} else {
				console.log('user: delete succ:');
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
	console.log('user: user search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;		
	console.log(query);
	User.getAll(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('user: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('user: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};



///Activation User
exports.cekdata = function(req, res){
	console.log('user: user search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	
	var input = {
		tgl_pemantauan_start : { $exists: false } 
	};

	var query = input;
	User.getAll(query,function(err, result){		
		// console.log(err);
		// console.log(result);
		result.forEach(data => {
			var twoWeeks = 1000 * 60 * 60 * 24 * 14;
			var twoYears = 1000 * 60 * 60 * 24 * 354;
			var tgl_str = new Date(data.date_add);
			if(data.level == "terkonfirmasi")
				var tgl_end = new Date(tgl_str.getTime() + twoYears); 
			else
				var tgl_end = new Date(tgl_str.getTime() + twoWeeks); 
			console.log(data.level+" -- "+tgl_str+" -- "+tgl_end);
			query = {
				tgl_pemantauan_start:tgl_str,
				tgl_pemantauan_end:tgl_end
			};
			User.updateById({_id:data._id},query, function(err, result){
				if(err){
					console.log("ERRROR "+data._id);
				} else {
					console.log("SUCCESS "+data._id);
				}
			});
			// exports.import_new(data.date_only);
		});
		if(!result){
			// console.log('user: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			// console.log('user: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};
