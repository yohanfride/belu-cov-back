"use strict";
const Config = require('../config/config');
const Common = require('../config/common');
const Daily = require('../model/daily.model').Daily;
const User = require('../model/user.model').User;
const Vaksin = require('../model/vaksin.model').Vaksin;
const Tes = require('../model/tes.model').Tes;
const async = require('async');
const moment = require('moment-timezone');
const qr = require('qr-image');
const fs = require('fs');
const path = require('path');
const kecamatan = require('../config/data-sampang.json');
const covid = require('../config/covid-level.json')
const conv = require('../config/conv.json')

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
	if(input.sort == 'date_add,DESC'){
		input.sort = {date_add:-1};
	} else if(input.sort == 'date_add,ASC'){
		input.sort = {date_add:1};
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
      		if(key_item == 'konfirmasi-dengan-gejala' || key_item == 'konfirmasi-tanpa-gejala'){
      			facet[key_item] = [
		      		{"$match":{"level":key, "konfirmasi_gejala":key_status,"status_pantau":1}},
			    	{"$count":key_item}
		      	];
		      	console.log(facet[key_item]);
      		} else {
      			facet[key_item] = [
		      		{"$match":{"level":key, "level_status":key_status,"status_pantau":1}},
			    	{"$count":key_item}
		      	];	
      		}      		
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
	      		if(key_item3 == 'terkonfirmasi-dengan-gejala' || key_item3 == 'terkonfirmasi-tanpa-gejala'){
	      			facet[key_item3] = [
			      		{"$match":{"level":key, "konfirmasi_gejala":key_status3, "kecamatan":key_status,"status_pantau":1}},
				    	{"$count":key_item3}
			      	];	
	      		} else {
	      			facet[key_item3] = [
			      		{"$match":{"level":key, "level_status":key_status3, "kecamatan":key_status,"status_pantau":1}},
				    	{"$count":key_item3}
			      	];
	      		}
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
      		if(key_item == 'konfirmasi-dengan-gejala' || key_item == 'konfirmasi-tanpa-gejala'){
      			facet[key_item] = [
		      		{"$match":{"level":key, "konfirmasi_gejala":key_status,"status_pantau":1}},
			    	{"$count":key_item}
		      	];
      		} else {
      			facet[key_item] = [
		      		{"$match":{"level":key, "level_status":key_status,"status_pantau":1}},
			    	{"$count":key_item}
		      	];	
      		}
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
	      		if(key_item3 == 'konfirmasi-dengan-gejala' || key_item3 == 'konfirmasi-tanpa-gejala'){
	      			facet[key_item3] = [
			      		{"$match":{"level":key, "konfirmasi_gejala":key_status3, "kecamatan":key_status,"status_pantau":1}},
				    	{"$count":key_item3}
			      	];	
	      		} else {
	      			facet[key_item3] = [
			      		{"$match":{"level":key, "level_status":key_status3, "kecamatan":key_status,"status_pantau":1}},
				    	{"$count":key_item3}
			      	];
	      		}
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
			// var datenow = new Date(); 
			// var datenow_string = datenow.getFullYear()+"-"+(datenow.getMonth() + 1)+"-"+datenow.getDate(); 
			var datenow_string = moment.utc().local().format('YYYY-M-D');
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
					query.date_add = moment.utc().local().format('YYYY-MM-DDTHH:mm:ss')+".000Z"; //new Date();
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
						exports.rekap_vaksin(datenow_string);
						exports.rekap_tes(datenow_string);
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
						exports.rekap_vaksin(datenow_string);
						exports.rekap_tes(datenow_string);
						
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
      		if(key_item == 'konfirmasi-dengan-gejala' || key_item == 'konfirmasi-tanpa-gejala'){
      			facet[key_item] = [
		      		{"$match":{"level":key, "konfirmasi_gejala":key_status,"status_pantau":1}},
			    	{"$count":key_item}
		      	];
      		} else {
      			facet[key_item] = [
		      		{"$match":{"level":key, "level_status":key_status,"status_pantau":1}},
			    	{"$count":key_item}
		      	];	
      		}
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
	      		if(key_item3 == 'konfirmasi-dengan-gejala' || key_item3 == 'konfirmasi-tanpa-gejala'){
	      			facet[key_item3] = [
			      		{"$match":{"level":key, "konfirmasi_gejala":key_status3, "kecamatan":key_status,"status_pantau":1}},
				    	{"$count":key_item3}
			      	];	
	      		} else {
	      			facet[key_item3] = [
			      		{"$match":{"level":key, "level_status":key_status3, "kecamatan":key_status,"status_pantau":1}},
				    	{"$count":key_item3}
			      	];
	      		}
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
    var query2 = listitem;
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
							// respon.data = 'success';
							respon.data = query2;
						}

						res.json(respon);		
					});		
				}			
			});
		}
	});	
};

//Daily Get Vaksin
exports.manual_insert_vaksin = function(req, res){
	var response = Config.base_response;
	var kelompok = conv['kelompok'];
	var facet = {}; 
	var project = {};
	var listitem = {};
	var key = 'vaksin';
  	facet[key] = [
  		{"$match":{}},
    	{"$count":key}
  	];
  	project[key] = { "$arrayElemAt":["$"+key+"."+key,0] };
  	listitem[key] = {};
  	listitem[key]['total'] = key;
  	for (var index in kelompok) {
  		var key_status = kelompok[index];
  		var key_item = key+"-"+key_status;
  		key_item = key_item.replace(" ","-").toLowerCase();
  		
  		facet[key_item] = [
      		{"$match":{"kelompok":key_status}},
	    	{"$count":key_item}
      	];	
      	project[key_item] = { "$arrayElemAt":["$"+key_item+"."+key_item,0] };
      	key_status = key_status.replace(" ","-").toLowerCase();
      	listitem[key][key_status] = key_item;
  	}
    var list_kecamatan = kecamatan["Kecamatan"];
    listitem['kecamatan'] = {};
    for (var index in list_kecamatan) {
		var key_status = list_kecamatan[index];
		key_item = "kecamatan-"+key_status.replace(" ","-").toLowerCase();
      	listitem['kecamatan'][key_status] = {};
      	
  		var key_item2 = key_item+"-"+key;
  		facet[key_item2] = [
      		{"$match":{"kecamatan":key_status}},
	    	{"$count":key_item2}
      	];
      	project[key_item2] = { "$arrayElemAt":["$"+key_item2+"."+key_item2,0] };
  		listitem['kecamatan'][key_status][key] = key_item2;
		var covid_status = covid[key];
  		for (var key2 in kelompok) {
      		var key_status3 = kelompok[key2];
      		var key_item3 = key_item2+"-"+key_status3;
      		key_item3 = key_item3.replace(" ","-").toLowerCase();
  			facet[key_item3] = [
	      		{"$match":{"kelompok":key_status3, "kecamatan":key_status}},
		    	{"$count":key_item3}
	      	];
	      	project[key_item3] = { "$arrayElemAt":["$"+key_item3+"."+key_item3,0] };
	      	key_status3 = key_status3.replace(" ","-").toLowerCase();
	      	listitem['kecamatan'][key_status][key+'-'+key_status3] = key_item3;
      	}
	}
    var query = [
    	{"$facet":facet},
    	{"$project":project}
    ];
    var query2 = query;
	Vaksin.multiCount(query,function(err, result){
		if(!result){
			console.log('daily: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			var datenow = new Date(); 
			if(!req.body.datenow){
				var datenow_string = datenow.getFullYear()+"-"+(datenow.getMonth() + 1)+"-"+datenow.getDate(); 	
			} else {
				var datenow_string = req.body.datenow;
			}
			
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
			listitem['vaksin']['kecamatan'] = listitem['kecamatan'];
			delete listitem['kecamatan'];
			query = listitem;
			Daily.get({ date_only:listitem.date_only },function(err, result){
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
						// respon.data = query2;
					}
					res.json(respon);		
				});		
			});
		}
	});	
};

//Daily Get Vaksin
exports.rekap_vaksin = function(date_input){
	var response = Config.base_response;
	var kelompok = conv['kelompok'];
	var facet = {}; 
	var project = {};
	var listitem = {};
	var key = 'vaksin';
  	facet[key] = [
  		{"$match":{}},
    	{"$count":key}
  	];
  	project[key] = { "$arrayElemAt":["$"+key+"."+key,0] };
  	listitem[key] = {};
  	listitem[key]['total'] = key;
  	for (var index in kelompok) {
  		var key_status = kelompok[index];
  		var key_item = key+"-"+key_status;
  		key_item = key_item.replace(" ","-").toLowerCase();
  		
  		facet[key_item] = [
      		{"$match":{"kelompok":key_status}},
	    	{"$count":key_item}
      	];	
      	project[key_item] = { "$arrayElemAt":["$"+key_item+"."+key_item,0] };
      	key_status = key_status.replace(" ","-").toLowerCase();
      	listitem[key][key_status] = key_item;
  	}
    var list_kecamatan = kecamatan["Kecamatan"];
    listitem['kecamatan'] = {};
    for (var index in list_kecamatan) {
		var key_status = list_kecamatan[index];
		key_item = "kecamatan-"+key_status.replace(" ","-").toLowerCase();
      	listitem['kecamatan'][key_status] = {};
      	
  		var key_item2 = key_item+"-"+key;
  		facet[key_item2] = [
      		{"$match":{"kecamatan":key_status}},
	    	{"$count":key_item2}
      	];
      	project[key_item2] = { "$arrayElemAt":["$"+key_item2+"."+key_item2,0] };
  		listitem['kecamatan'][key_status][key] = key_item2;
		var covid_status = covid[key];
  		for (var key2 in kelompok) {
      		var key_status3 = kelompok[key2];
      		var key_item3 = key_item2+"-"+key_status3;
      		key_item3 = key_item3.replace(" ","-").toLowerCase();
  			facet[key_item3] = [
	      		{"$match":{"kelompok":key_status3, "kecamatan":key_status}},
		    	{"$count":key_item3}
	      	];
	      	project[key_item3] = { "$arrayElemAt":["$"+key_item3+"."+key_item3,0] };
	      	key_status3 = key_status3.replace(" ","-").toLowerCase();
	      	listitem['kecamatan'][key_status][key+'-'+key_status3] = key_item3;
      	}
	}
    var query = [
    	{"$facet":facet},
    	{"$project":project}
    ];
    var query2 = query;
	Vaksin.multiCount(query,function(err, result){
		if(!result){
			console.log('daily: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			var datenow = new Date(); 
			if(!date_input){
				var datenow_string = datenow.getFullYear()+"-"+(datenow.getMonth() + 1)+"-"+datenow.getDate(); 	
			} else {
				var datenow_string = date_input;
			}
			
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
			listitem['vaksin']['kecamatan'] = listitem['kecamatan'];
			delete listitem['kecamatan'];
			query = listitem;
			Daily.get({ date_only:listitem.date_only },function(err, result){
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
						// respon.data = query2;
					}
					// res.json(respon);		
				});		
			});
		}
	});	
};


//Daily Get Vaksin
exports.rekap_tes = function(date_input){
	var response = Config.base_response;
	var kelompok = conv['tes'];
	var facet = {}; 
	var project = {};
	var listitem = {};
	var key = 'tes';
  	facet[key] = [
  		{"$match":{}},
    	{"$count":key}
  	];
  	project[key] = { "$arrayElemAt":["$"+key+"."+key,0] };
  	listitem[key] = {};
  	listitem[key]['total'] = key;
  	for (var index in kelompok) {
  		var key_status = kelompok[index];
  		var key_item = key+"-"+key_status;
  		key_item = key_item.replace(" ","-").toLowerCase();
  		
  		facet[key_item] = [
      		{"$match":{"jenis":key_status}},
	    	{"$count":key_item}
      	];	
      	project[key_item] = { "$arrayElemAt":["$"+key_item+"."+key_item,0] };
      	key_status = key_status.replace(" ","-").toLowerCase();
      	listitem[key][key_status] = key_item;
  	}
    var list_kecamatan = kecamatan["Kecamatan"];
    listitem['kecamatan'] = {};
    for (var index in list_kecamatan) {
		var key_status = list_kecamatan[index];
		key_item = "kecamatan-"+key_status.replace(" ","-").toLowerCase();
      	listitem['kecamatan'][key_status] = {};
      	
  		var key_item2 = key_item+"-"+key;
  		facet[key_item2] = [
      		{"$match":{"kecamatan":key_status}},
	    	{"$count":key_item2}
      	];
      	project[key_item2] = { "$arrayElemAt":["$"+key_item2+"."+key_item2,0] };
  		listitem['kecamatan'][key_status][key] = key_item2;
		var covid_status = covid[key];
  		for (var key2 in kelompok) {
      		var key_status3 = kelompok[key2];
      		var key_item3 = key_item2+"-"+key_status3;
      		key_item3 = key_item3.replace(" ","-").toLowerCase();
  			facet[key_item3] = [
	      		{"$match":{"jenis":key_status3, "kecamatan":key_status}},
		    	{"$count":key_item3}
	      	];
	      	project[key_item3] = { "$arrayElemAt":["$"+key_item3+"."+key_item3,0] };
	      	key_status3 = key_status3.replace(" ","-").toLowerCase();
	      	listitem['kecamatan'][key_status][key+'-'+key_status3] = key_item3;
      	}
	}
    var query = [
    	{"$facet":facet},
    	{"$project":project}
    ];
    var query2 = query;
	Tes.multiCount(query,function(err, result){
		if(!result){
			console.log('daily: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			var datenow = new Date(); 
			if(!date_input){
				var datenow_string = datenow.getFullYear()+"-"+(datenow.getMonth() + 1)+"-"+datenow.getDate(); 	
			} else {
				var datenow_string = date_input;
			}
			
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
			listitem['tes']['kecamatan'] = listitem['kecamatan'];
			delete listitem['kecamatan'];
			query = listitem;
			Daily.get({ date_only:listitem.date_only },function(err, result){
				var data = result;
				Daily.updateById({_id:data._id},query, function(err, result){
					var respon = Config.base_response;
					if(err){
						console.log('daily: tes edit err:', err);
						respon.is_success = false;
						respon.description = 'Failed';
						respon.data = err;
					} else {
						console.log('daily: tes edit succ:');
						respon.is_success = true;
						respon.description = 'success';
						respon.data = 'success';
						// respon.data = query2;
					}
					// res.json(respon);		
				});		
			});
		}
	});	
};

//Daily Get by Dailyname
exports.import_new = function(date_input){
	var response = Config.base_response;
	
	var facet = {}; 
	var project = {};
	var listitem = {};
	for (var key in covid) {
      	facet[key] = [
      		{"$match":{"level":key,
		    			"tgl_pemantauan_start": { "$lte": new Date(date_input+"T00:00:00.000Z") },
						"$or":[
							{"tgl_pemantauan_end": { "$gte": new Date(date_input+"T00:00:00.000Z")}},
							{"status_pantau":1}
						]
					}
			},
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
      		if(key_item == 'konfirmasi-dengan-gejala' || key_item == 'konfirmasi-tanpa-gejala'){
      			facet[key_item] = [
		      		{"$match":{"level":key, "konfirmasi_gejala":key_status,
		      					"tgl_pemantauan_start": { "$lte": new Date(date_input+"T00:00:00.000Z") },
								"$or":[
									{"tgl_pemantauan_end": { "$gte": new Date(date_input+"T00:00:00.000Z")}},
									{"status_pantau":1}
								]}
					},
			    	{"$count":key_item}
		      	];
      		} else {
      			facet[key_item] = [
		      		{"$match":{"level":key, "level_status":key_status,
		      				"tgl_pemantauan_start": { "$lte": new Date(date_input+"T00:00:00.000Z") },
							"$or":[
								{"tgl_pemantauan_end": { "$gte": new Date(date_input+"T00:00:00.000Z")}},
								{"status_pantau":1}
							]}
					},
			    	{"$count":key_item}
		      	];	
      		}
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
      		{"$match":{"kecamatan":key_status,
      				"tgl_pemantauan_start": { "$lte": new Date(date_input+"T00:00:00.000Z") },
					"$or":[
						{"tgl_pemantauan_end": { "$gte": new Date(date_input+"T00:00:00.000Z")}},
						{"status_pantau":1}
					]}
			},
	    	{"$count":key_item}
      	];
      	project[key_item] = { "$arrayElemAt":["$"+key_item+"."+key_item,0] };
      	listitem['kecamatan'][key_status] = {};
      	listitem['kecamatan'][key_status]['total'] = key_item;
      	for (var key in covid) {
      		var key_item2 = key_item+"-"+key;
      		facet[key_item2] = [
	      		{"$match":{"level":key, "kecamatan":key_status,
			      		"tgl_pemantauan_start": { "$lte": new Date(date_input+"T00:00:00.000Z") },
						"$or":[
							{"tgl_pemantauan_end": { "$gte": new Date(date_input+"T00:00:00.000Z")}},
							{"status_pantau":1}
						]}
				},
		    	{"$count":key_item2}
	      	];
	      	project[key_item2] = { "$arrayElemAt":["$"+key_item2+"."+key_item2,0] };
      		listitem['kecamatan'][key_status][key] = key_item2;
			var covid_status = covid[key];
      		for (var key2 in covid_status) {
	      		var key_status3 = covid_status[key2];
	      		var key_item3 = key_item2+"-"+key_status3;
	      		key_item3 = key_item3.replace(" ","-").toLowerCase();
	      		if(key_item3 == 'konfirmasi-dengan-gejala' || key_item3 == 'konfirmasi-tanpa-gejala'){
	      			facet[key_item3] = [
			      		{"$match":{"level":key, "konfirmasi_gejala":key_status3, "kecamatan":key_status,
			      				"tgl_pemantauan_start": { "$lte": new Date(date_input+"T00:00:00.000Z") },
								"$or":[
									{"tgl_pemantauan_end": { "$gte": new Date(date_input+"T00:00:00.000Z")}},
									{"status_pantau":1}
								]}
						},
				    	{"$count":key_item3}
			      	];	
	      		} else {
	      			facet[key_item3] = [
			      		{"$match":{"level":key, "level_status":key_status3, "kecamatan":key_status,
			      				"tgl_pemantauan_start": { "$lte": new Date(date_input+"T00:00:00.000Z") },
								"$or":[
									{"tgl_pemantauan_end": { "$gte": new Date(date_input+"T00:00:00.000Z")}},
									{"status_pantau":1}
								]}
						},
				    	{"$count":key_item3}
			      	];
	      		}
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
 //    var fs = require('fs');
	// fs.writeFile ("cek/"+date_input+".json", JSON.stringify(query), function(err) {
	//     if (err) throw err;
	//     console.log('complete '+date_input+".json");
	//     }
	// );

	User.multiCount(query,function(err, result){
		console.log('CEK DATA '+date_input+".json");
		if(!result){
			console.log('daily: detail err:', err);
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;			
		} else {
			var datenow_string = date_input; 
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
			query['date_only'] = query['date_only'].replace(/(^|-)0+/g, "$1");
			Daily.get({ date_only:query['date_only'] },function(err, result){
				console.log(query['date_only']);
				// console.log(result);
				if(!result){
					query['date_add'] = new Date(date_input+"T23:59:00.000Z");
					Daily.create(query, function(err, result){
						var respon = Config.base_response;		
						if(err){
							console.log('daily: add err: '+query['date_add']);
							Daily.get({ date_only:query['date_only'] },function(err, result){
								var data = result;
								Daily.updateById({_id:data._id},query, function(err, result){
									var respon = Config.base_response;
									if(err){
										console.log('ERROR DUPLICATES daily: edit err: '+query['date_add']);
										respon.is_success = false;
										respon.description = 'Failed';
										respon.data = err;
									} else {
										console.log('ERROR DUPLICATES daily: edit succ: '+query['date_add']);
										respon.is_success = true;
										respon.description = 'success';
										respon.data = 'success';
									}
									exports.rekap_vaksin(datenow_string);
									exports.rekap_tes(datenow_string);
									//res.json(respon);		
								});		
							});
						} else {
							console.log('daily: add succ:');
							respon.is_success = true;
							respon.description = 'success';
							respon.data = 'success';			
						}
						// exports.rekap_vaksin(datenow_string);
						// exports.rekap_tes(datenow_string);
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
						// exports.rekap_vaksin(datenow_string);
						// exports.rekap_tes(datenow_string);
						//res.json(respon);		
					});		
				}			
			});
		}
	});	
};

exports.hitungulang = function(req, res){
	console.log('daily: daily search');
	var input = JSON.parse(JSON.stringify(req.body));	
	var response = Config.base_response;
	var query = input;
	console.log(query);
	Daily.getAll(query,function(err, result){		
		console.log(err);
		console.log(result);

		result.forEach(data => {
			var today = new Date(data.date_only);
			var dd = today.getDate();
			var mm = today.getMonth()+1; 
			var yyyy = today.getFullYear();
			if(dd<10) 
				dd='0'+dd;
			if(mm<10) 
			    mm='0'+mm;
			var newdate = yyyy+"-"+mm+"-"+dd;
			// console.log(data.date_only+" -> "+newdate)
			exports.import_new(newdate);
			// Daily.get({ date_only:data.date_only },function(err, result){
			// 	console.log( moment.utc().local().format('YYYY-M-D') ); //
			// 	var data = result;
			// 	var query = {
			// 		date_add : newdate+"T09:00:00.000Z"
			// 	};
			// 	console.log(query);
			// 	Daily.updateById({_id:data._id},query, function(err, result){
			// 		var respon = Config.base_response;
			// 		if(err){
			// 			console.log('daily: edit err:', err);
			// 			respon.is_success = false;
			// 			respon.description = 'Failed';
			// 			respon.data = err;
			// 		} else {
			// 			console.log('daily: edit succ:');
			// 			respon.is_success = true;
			// 			respon.description = 'success';
			// 			respon.data = 'success';
			// 			// respon.data = query2;
			// 		}
			// 		// res.json(respon);		
			// 	});		
			// });
		});

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