"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const Daily = require('../model/daily.model').Daily;
const User = require('../model/user.model').User;
const async = require('async');
const moment = require('moment-timezone');
const qr = require('qr-image');
const fs = require('fs');
const path = require('path');
const kecamatan = require('../config/data-sampang.json');
const covid = require('../config/covid-level.json')

/*
 * GET dailys listing.
 */

exports.daily = function(req, res){
	console.log('daily:  list');	
	var response = Config.base_response;
	var query = {};
	Daily.getAll(query, function (err, result) {
		if(err){
			console.log('daily: list err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('daily: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

/*Save the daily*/
exports.save = function(req,res){    	
	console.log('daily: save');	
	var respon = Config.base_response;	
	var input = JSON.parse(JSON.stringify(req.body));
	if(!input.date_only){
		input.date_only = new Date().toISOString().slice(0,10);	
	} 
    var query = input;
    Daily.get({ date_only:input.date_only },function(err, result){
		if(!result){
			Daily.create(query, function(err, result){
				var respon = Config.base_response;		
				if(err){
					console.log('daily: add err:', err);
					respon.is_success = false;
					respon.description = 'Failed';
					respon.data = err;
				} else {
					console.log('daily: add succ:');
					respon.is_success = true;
					respon.description = 'success';
					respon.data = 'success';			
				}
				res.json(respon);		
			});		
		} else {
			var data = result;
			Daily.updateById({_id:data._id},query, function(err, result){
				var respon = Config.base_response;
				if(err){
					console.log('daily: edit err:', err);
					respon.is_success = false;
					respon.description = 'Failed';
					respon.data = err;
				} else {
					console.log('daily: edit succ:');
					respon.is_success = true;
					respon.description = 'success';
					respon.data = 'success';
				}
				res.json(respon);		
			});		
		}			
	});			
};



//Daily Get by Dailyname
exports.daily_detail = function(req, res){
	console.log('daily: daily list');
	var id = req.params.id;  	
	var response = Config.base_response;
	var query = {_id:id};	
	Daily.get(query,function(err, result){
		if(!result){
			console.log('daily: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('daily: detail succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

///Activation Daily
exports.search = function(req, res){
	console.log('daily: daily search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.str_date && input.end_date){
		input.date_add = { $gte: new Date(input.str_date+"T00:00:00.000Z"), $lte:  new Date(input.end_date+"T23:59:59.000Z") };
		delete input.str_date;
		delete input.end_date;
	}
	var query = input;
	console.log(query);
	Daily.getAll(query,function(err, result){		
		console.log(err);
		console.log(result);
		if(!result){
			console.log('daily: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('daily: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};


///Activation Daily
exports.search_count = function(req, res){
	console.log('daily: daily count');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	if(input.str_date && input.end_date){
		input.date_add = { $gte: new Date(input.str_date+"T00:00:00.000Z"), $lte:  new Date(input.end_date+"T23:59:59.000Z") };
		delete input.str_date;
		delete input.end_date;
	}
	var query = input;		
	console.log(query);
	Daily.getCount(query,function(err, result){		
		console.log(result);
		if(!result){
			console.log('daily: search err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			console.log('daily: search succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;			
		}
		res.json(response);		
	});	
};

//Daily Get by Dailyname
exports.get_recap_today = function(req, res){
	var response = Config.base_response;
	
	var facet = {}; 
	var project = {};
	var listitem = {};
	for (var key in covid) {
      	facet[key] = [
      		{"$match":{"level":key,"status_pantau":1}},
	    	{"$count":key}
      	];
      	project[key] = { "$arrayElemAt":["$"+key+"."+key,0] };
      	listitem[key] = {};
      	listitem[key]['total'] = key;
      	var covid_status = covid[key];
      	for (var index in covid_status) {
      		var key_status = covid_status[index];
      		var key_item = key+"-"+key_status;
      		key_item = key_item.replace(" ","-").toLowerCase();
      		facet[key_item] = [
	      		{"$match":{"level":key, "level_status":key_status,"status_pantau":1}},
		    	{"$count":key_item}
	      	];
	      	project[key_item] = { "$arrayElemAt":["$"+key_item+"."+key_item,0] };
	      	key_status = key_status.replace(" ","-").toLowerCase();
	      	listitem[key][key_status] = key_item;
      	}
    }
    var list_kecamatan = kecamatan["Kecamatan"];
    listitem['kecamatan'] = {};
    for (var index in list_kecamatan) {
		var key_status = list_kecamatan[index];
		key_item = "kecamatan-"+key_status.replace(" ","-").toLowerCase();
		facet[key_item] = [
      		{"$match":{"kecamatan":key_status,"status_pantau":1}},
	    	{"$count":key_item}
      	];
      	project[key_item] = { "$arrayElemAt":["$"+key_item+"."+key_item,0] };
      	listitem['kecamatan'][key_status] = {};
      	listitem['kecamatan'][key_status]['total'] = key_item;
      	for (var key in covid) {
      		var key_item2 = key_item+"-"+key;
      		facet[key_item2] = [
	      		{"$match":{"level":key, "kecamatan":key_status,"status_pantau":1}},
		    	{"$count":key_item2}
	      	];
	      	project[key_item2] = { "$arrayElemAt":["$"+key_item2+"."+key_item2,0] };
      		listitem['kecamatan'][key_status][key] = key_item2;
			var covid_status = covid[key];
      		for (var key2 in covid_status) {
	      		var key_status3 = covid_status[key2];
	      		var key_item3 = key_item2+"-"+key_status3;
	      		key_item3 = key_item3.replace(" ","-").toLowerCase();
	      		facet[key_item3] = [
		      		{"$match":{"level":key, "level_status":key_status3, "kecamatan":key_status,"status_pantau":1}},
			    	{"$count":key_item3}
		      	];
		      	project[key_item3] = { "$arrayElemAt":["$"+key_item3+"."+key_item3,0] };
		      	key_status3 = key_status3.replace(" ","-").toLowerCase();
		      	listitem['kecamatan'][key_status][key+'-'+key_status3] = key_item3;
	      	}

      	}
	}
    var query = [
    	{"$facet":facet},
    	{"$project":project}
    ];
	User.multiCount(query,function(err, result){
		if(!result){
			console.log('daily: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			var datenow = new Date(); 
			var datenow_string = datenow.getFullYear()+"-"+(datenow.getMonth() + 1)+"-"+datenow.getDate(); 
			var data = result[0];
			for(var key in listitem){
				if (typeof listitem[key] === 'string') {
					var index = listitem[key];
					if( data.hasOwnProperty(index) )
						listitem[key] = data[index];
					else 
						listitem[key] = 0;
				} else {
					for(var key2 in listitem[key]){
						if (typeof listitem[key][key2] === 'string') {
							var index = listitem[key][key2];
							if( data.hasOwnProperty(index) )
								listitem[key][key2] = data[index];
							else 
								listitem[key][key2] = 0;
						} else {
							for(var key3 in listitem[key][key2]){
								if (typeof listitem[key][key2][key3] === 'string') {
									var index = listitem[key][key2][key3];
									if( data.hasOwnProperty(index) )
										listitem[key][key2][key3] = data[index];
									else 
										listitem[key][key2][key3] = 0;
								} 
							}	
						}
					}
				}
			}
			listitem['date_only'] = datenow_string;
			query = listitem;
			console.log('daily: recap err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = query;
		}
		res.json(response);
	});	
};


//Daily Get by Dailyname
exports.new = function(){
	var response = Config.base_response;
	
	var facet = {}; 
	var project = {};
	var listitem = {};
	for (var key in covid) {
      	facet[key] = [
      		{"$match":{"level":key,"status_pantau":1}},
	    	{"$count":key}
      	];
      	project[key] = { "$arrayElemAt":["$"+key+"."+key,0] };
      	listitem[key] = {};
      	listitem[key]['total'] = key;
      	var covid_status = covid[key];
      	for (var index in covid_status) {
      		var key_status = covid_status[index];
      		var key_item = key+"-"+key_status;
      		key_item = key_item.replace(" ","-").toLowerCase();
      		facet[key_item] = [
	      		{"$match":{"level":key, "level_status":key_status,"status_pantau":1}},
		    	{"$count":key_item}
	      	];
	      	project[key_item] = { "$arrayElemAt":["$"+key_item+"."+key_item,0] };
	      	key_status = key_status.replace(" ","-").toLowerCase();
	      	listitem[key][key_status] = key_item;
      	}
    }
    var list_kecamatan = kecamatan["Kecamatan"];
    listitem['kecamatan'] = {};
    for (var index in list_kecamatan) {
		var key_status = list_kecamatan[index];
		key_item = "kecamatan-"+key_status.replace(" ","-").toLowerCase();
		facet[key_item] = [
      		{"$match":{"kecamatan":key_status,"status_pantau":1}},
	    	{"$count":key_item}
      	];
      	project[key_item] = { "$arrayElemAt":["$"+key_item+"."+key_item,0] };
      	listitem['kecamatan'][key_status] = {};
      	listitem['kecamatan'][key_status]['total'] = key_item;
      	for (var key in covid) {
      		var key_item2 = key_item+"-"+key;
      		facet[key_item2] = [
	      		{"$match":{"level":key, "kecamatan":key_status,"status_pantau":1}},
		    	{"$count":key_item2}
	      	];
	      	project[key_item2] = { "$arrayElemAt":["$"+key_item2+"."+key_item2,0] };
      		listitem['kecamatan'][key_status][key] = key_item2;
			var covid_status = covid[key];
      		for (var key2 in covid_status) {
	      		var key_status3 = covid_status[key2];
	      		var key_item3 = key_item2+"-"+key_status3;
	      		key_item3 = key_item3.replace(" ","-").toLowerCase();
	      		facet[key_item3] = [
		      		{"$match":{"level":key, "level_status":key_status3, "kecamatan":key_status,"status_pantau":1}},
			    	{"$count":key_item3}
		      	];
		      	project[key_item3] = { "$arrayElemAt":["$"+key_item3+"."+key_item3,0] };
		      	key_status3 = key_status3.replace(" ","-").toLowerCase();
		      	listitem['kecamatan'][key_status][key+'-'+key_status3] = key_item3;
	      	}

      	}
	}
    var query = [
    	{"$facet":facet},
    	{"$project":project}
    ];
	User.multiCount(query,function(err, result){
		if(!result){
			console.log('daily: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			var datenow = new Date(); 
			var datenow_string = datenow.getFullYear()+"-"+(datenow.getMonth() + 1)+"-"+datenow.getDate(); 
			var data = result[0];
			for(var key in listitem){
				if (typeof listitem[key] === 'string') {
					var index = listitem[key];
					if( data.hasOwnProperty(index) )
						listitem[key] = data[index];
					else 
						listitem[key] = 0;
				} else {
					for(var key2 in listitem[key]){
						if (typeof listitem[key][key2] === 'string') {
							var index = listitem[key][key2];
							if( data.hasOwnProperty(index) )
								listitem[key][key2] = data[index];
							else 
								listitem[key][key2] = 0;
						} else {
							for(var key3 in listitem[key][key2]){
								if (typeof listitem[key][key2][key3] === 'string') {
									var index = listitem[key][key2][key3];
									if( data.hasOwnProperty(index) )
										listitem[key][key2][key3] = data[index];
									else 
										listitem[key][key2][key3] = 0;
								} 
							}	
						}
					}
				}
			}
			listitem['date_only'] = datenow_string;
			query = listitem;
			Daily.get({ date_only:listitem.date_only },function(err, result){
				if(!result){
					Daily.create(query, function(err, result){
						var respon = Config.base_response;		
						if(err){
							console.log('daily: add err:', err);
							respon.is_success = false;
							respon.description = 'Failed';
							respon.data = err;
						} else {
							console.log('daily: add succ:');
							respon.is_success = true;
							respon.description = 'success';
							respon.data = 'success';			
						}
						//res.json(respon);		
					});		
				} else {
					var data = result;
					Daily.updateById({_id:data._id},query, function(err, result){
						var respon = Config.base_response;
						if(err){
							console.log('daily: edit err:', err);
							respon.is_success = false;
							respon.description = 'Failed';
							respon.data = err;
						} else {
							console.log('daily: edit succ:');
							respon.is_success = true;
							respon.description = 'success';
							respon.data = 'success';
						}
						//res.json(respon);		
					});		
				}			
			});
		}
	});	
};


//Daily Get by Dailyname
exports.manual_insert = function(req, res){
	var response = Config.base_response;
	
	var facet = {}; 
	var project = {};
	var listitem = {};
	for (var key in covid) {
      	facet[key] = [
      		{"$match":{"level":key}},
	    	{"$count":key}
      	];
      	project[key] = { "$arrayElemAt":["$"+key+"."+key,0] };
      	listitem[key] = {};
      	listitem[key]['total'] = key;
      	var covid_status = covid[key];
      	for (var index in covid_status) {
      		var key_status = covid_status[index];
      		var key_item = key+"-"+key_status;
      		key_item = key_item.replace(" ","-").toLowerCase();
      		facet[key_item] = [
	      		{"$match":{"level":key, "level_status":key_status}},
		    	{"$count":key_item}
	      	];
	      	project[key_item] = { "$arrayElemAt":["$"+key_item+"."+key_item,0] };
	      	key_status = key_status.replace(" ","-").toLowerCase();
	      	listitem[key][key_status] = key_item;
      	}
    }
    var list_kecamatan = kecamatan["Kecamatan"];
    listitem['kecamatan'] = {};
    for (var index in list_kecamatan) {
		var key_status = list_kecamatan[index];
		key_item = "kecamatan-"+key_status.replace(" ","-").toLowerCase();
		facet[key_item] = [
      		{"$match":{"kecamatan":key_status}},
	    	{"$count":key_item}
      	];
      	project[key_item] = { "$arrayElemAt":["$"+key_item+"."+key_item,0] };
      	listitem['kecamatan'][key_status] = {};
      	listitem['kecamatan'][key_status]['total'] = key_item;
      	for (var key in covid) {
      		var key_item2 = key_item+"-"+key;
      		facet[key_item2] = [
	      		{"$match":{"level":key, "kecamatan":key_status}},
		    	{"$count":key_item2}
	      	];
	      	project[key_item2] = { "$arrayElemAt":["$"+key_item2+"."+key_item2,0] };
      		listitem['kecamatan'][key_status][key] = key_item2;
			var covid_status = covid[key];
      		for (var key2 in covid_status) {
	      		var key_status3 = covid_status[key2];
	      		var key_item3 = key_item2+"-"+key_status3;
	      		key_item3 = key_item3.replace(" ","-").toLowerCase();
	      		facet[key_item3] = [
		      		{"$match":{"level":key, "level_status":key_status3, "kecamatan":key_status}},
			    	{"$count":key_item3}
		      	];
		      	project[key_item3] = { "$arrayElemAt":["$"+key_item3+"."+key_item3,0] };
		      	key_status3 = key_status3.replace(" ","-").toLowerCase();
		      	listitem['kecamatan'][key_status][key+'-'+key_status3] = key_item3;
	      	}

      	}
	}
    var query = [
    	{"$facet":facet},
    	{"$project":project}
    ];
	User.multiCount(query,function(err, result){
		if(!result){
			console.log('daily: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			var datenow = new Date(); 
			var datenow_string = datenow.getFullYear()+"-"+(datenow.getMonth() + 1)+"-"+datenow.getDate(); 
			var data = result[0];
			for(var key in listitem){
				if (typeof listitem[key] === 'string') {
					var index = listitem[key];
					if( data.hasOwnProperty(index) )
						listitem[key] = data[index];
					else 
						listitem[key] = 0;
				} else {
					for(var key2 in listitem[key]){
						if (typeof listitem[key][key2] === 'string') {
							var index = listitem[key][key2];
							if( data.hasOwnProperty(index) )
								listitem[key][key2] = data[index];
							else 
								listitem[key][key2] = 0;
						} else {
							for(var key3 in listitem[key][key2]){
								if (typeof listitem[key][key2][key3] === 'string') {
									var index = listitem[key][key2][key3];
									if( data.hasOwnProperty(index) )
										listitem[key][key2][key3] = data[index];
									else 
										listitem[key][key2][key3] = 0;
								} 
							}	
						}
					}
				}
			}
			listitem['date_only'] = datenow_string;
			query = listitem;
			Daily.get({ date_only:listitem.date_only },function(err, result){
				if(!result){
					Daily.create(query, function(err, result){
						var respon = Config.base_response;		
						if(err){
							console.log('daily: add err:', err);
							respon.is_success = false;
							respon.description = 'Failed';
							respon.data = err;
						} else {
							console.log('daily: add succ:');
							respon.is_success = true;
							respon.description = 'success';
							respon.data = 'success';			
						}
						res.json(respon);		
					});		
				} else {
					var data = result;
					Daily.updateById({_id:data._id},query, function(err, result){
						var respon = Config.base_response;
						if(err){
							console.log('daily: edit err:', err);
							respon.is_success = false;
							respon.description = 'Failed';
							respon.data = err;
						} else {
							console.log('daily: edit succ:');
							respon.is_success = true;
							respon.description = 'success';
							respon.data = 'success';
						}
						res.json(respon);		
					});		
				}			
			});
		}
	});	
};
