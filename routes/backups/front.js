
const Config = require('../config/config');
const Common = require('../config/common');
const front = require('../model/front.model').Front;
const async = require('async');
const moment = require('moment-timezone');


/*
 * GET fronts listing.
 */

function convertToSlug(Text){
    return Text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}


exports.all = function(req, res){
	console.log('front:  list');
	let response = Config.base_response;	
	query = {};
	front.get(query, function(err, result){
		if(!result){
			console.log('front: list not found');
			response.is_success = false;
			response.description = 'Failed';
			response.data = err;
			//res.status(404).send({msg: err});
		} else {
			console.log('front: list succ:', result);			
			response.is_success = true;
			response.description = 'success';
			response.data = result;
			//res.render('front', {page_title:"front - Node.js", data: result})
		}
		res.json(response);		
	});	
};

/*Save the front*/
exports.save = function(req,res){    	
	let response = Config.base_response;
	console.log('front: save');
	var input = JSON.parse(JSON.stringify(req.body));	    
	var query = input;		
	front.create(query, function(err, result){
		let respon = Config.base_response;		
		if(err){
			console.log('front: add err:', err);			
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {			
			console.log('front: add succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';			
			console.log(respon.data);			
		}
		res.json(response);		
	});	
};


/*Edit the front*/
exports.edit = function(req,res){    	
	let respon = Config.base_response;
	console.log('front: save');	
  	var id = req.params.id;	 	
  	var input = JSON.parse(JSON.stringify(req.body));	    
  	query = input;  	
  	var src = { _id:id};
	front.updateByIdAdd(src,query, function(err, result){
		let respon = Config.base_response;		
		if(err){
			console.log('front: edit err:', err);
			respon.is_success = false;
			respon.description = 'Failed';
			respon.data = err;
		} else {			
			console.log('front: edit succ:');
			respon.is_success = true;
			respon.description = 'success';
			respon.data = 'success';						
		}
		res.json(respon);		
	});	
};


