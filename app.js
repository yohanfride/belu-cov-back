"use strict";
/**
 * Module dependencies.
 */
const Config = require('./config/config');
process.env.PORT = Config.server.port;
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');

//load user route
var user = require('./routes/user');
var admin = require('./routes/admin');
var gugustugas = require('./routes/gugustugas');
var qrcode = require('./routes/qrcode');
var logs = require('./routes/log');
var faskes = require('./routes/faskes');
var daily = require('./routes/daily');


var infografis = require('./routes/infografis');
var rumahisolasi = require('./routes/rumahisolasi');
var video = require('./routes/video');
var homeslide = require('./routes/homeslide');
var cron = require('node-schedule');

var app = express();
app.set('port', process.env.PORT || 3000);
//app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, '/public')));


app.use(express.static(path.join(__dirname, '/public')));

app.use('/qr', express.static( path.join(__dirname, '/public/qr') ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', routes.index);

///User
app.get('/user/',user.user);
app.post('/user/',user.save);
app.post('/user/scan/:id',user.edit_user_scan);
app.get('/user/detail/:id',user.user_detail);
app.post('/user/edit/:id',user.edit_user);
app.get('/user/delete/:id',user.delete_user);
app.post('/user/search/',user.search);
app.get('/user/status/:id/:status',user.change_status);
app.post('/user/search_all/',user.search_all);
app.post('/user/count/',user.search_count);
app.post('/user/radius/',user.searchRadius);

///admin
app.get('/admin/',admin.admin);
app.post('/admin/',admin.save);
app.get('/admin/detail/:id',admin.admin_detail);
app.post('/admin/edit/:id',admin.edit_admin);
app.get('/admin/delete/:id',admin.delete_admin);
app.post('/admin/pass/:id',admin.edit_pass_admin);
app.post('/admin/resetpass/:id',admin.reset_pass_admin);
app.post('/admin/login/',admin.login);
app.post('/admin/activation/',admin.admin_activation);
app.post('/admin/search/',admin.search);
app.get('/admin/status/:id/:status',admin.change_status);
app.post('/admin/search_all/',admin.search_all);
app.post('/admin/count/',admin.search_count);

///gugustugas
app.get('/gugustugas/',gugustugas.gugustugas);
app.post('/gugustugas/',gugustugas.save);
app.post('/gugustugas/multi',gugustugas.save_multi);
app.get('/gugustugas/detail/:id',gugustugas.gugustugas_detail);
app.post('/gugustugas/edit/:id',gugustugas.edit_gugustugas);
app.get('/gugustugas/delete/:id',gugustugas.delete_gugustugas);
app.post('/gugustugas/pass/:id',gugustugas.edit_pass_gugustugas);
app.post('/gugustugas/resetpass/:id',gugustugas.reset_pass_gugustugas);
app.post('/gugustugas/login/',gugustugas.login);
app.post('/gugustugas/activation/',gugustugas.gugustugas_activation);
app.post('/gugustugas/search/',gugustugas.search);
app.get('/gugustugas/status/:id/:status',gugustugas.change_status);
app.post('/gugustugas/search_all/',gugustugas.search_all);
app.post('/gugustugas/count/',gugustugas.search_count);

///QRCode
app.get('/qrcode/',qrcode.qrcode);
app.post('/qrcode/',qrcode.save);
app.post('/qrcode/multi',qrcode.save_multi);
app.get('/qrcode/detail/:id',qrcode.qrcode_detail);
app.post('/qrcode/edit/:id',qrcode.edit_qrcode);
app.get('/qrcode/delete/:id',qrcode.delete_qrcode);
app.post('/qrcode/search/',qrcode.search);
app.post('/qrcode/search_all/',qrcode.search_all);
app.post('/qrcode/count/',qrcode.search_count);

///Logs
app.get('/log/',logs.logs);
app.get('/log/detail/:id',logs.logs_detail);
app.post('/log/search/',logs.search);
app.post('/log/count/',logs.search_count);

///Faskes
app.get('/faskes/',faskes.faskes);
app.post('/faskes/',faskes.save);
app.get('/faskes/detail/:id',faskes.faskes_detail);
app.post('/faskes/edit/:id',faskes.edit_faskes);
app.get('/faskes/delete/:id',faskes.delete_faskes);
app.post('/faskes/search/',faskes.search);
app.post('/faskes/count/',faskes.search_count);
app.post('/faskes/radius/',faskes.searchRadius);

///Daily
app.get('/daily/',daily.daily);
app.post('/daily/',daily.save);
app.get('/daily/detail/:id',daily.daily_detail);
app.post('/daily/search/',daily.search);
app.post('/daily/count/',daily.search_count);
app.post('/daily/today/',daily.get_recap_today);

///Rumah Isolasi
app.get('/rumahisolasi/',rumahisolasi.rumahisolasi);
app.post('/rumahisolasi/',rumahisolasi.save);
app.get('/rumahisolasi/detail/:id',rumahisolasi.rumahisolasi_detail);
app.post('/rumahisolasi/edit/:id',rumahisolasi.edit_rumahisolasi);
app.get('/rumahisolasi/delete/:id',rumahisolasi.delete_rumahisolasi);
app.post('/rumahisolasi/search/',rumahisolasi.search);
app.post('/rumahisolasi/count/',rumahisolasi.search_count);
app.post('/rumahisolasi/radius/',rumahisolasi.searchRadius);

///Info Grafis
app.get('/infografis/',infografis.infografis);
app.post('/infografis/',infografis.save);
app.get('/infografis/detail/:id',infografis.infografis_detail);
app.post('/infografis/edit/:id',infografis.edit_infografis);
app.get('/infografis/delete/:id',infografis.delete_infografis);
app.post('/infografis/search/',infografis.search);
app.post('/infografis/count/',infografis.search_count);

///Video
app.get('/video/',video.video);
app.post('/video/',video.save);
app.get('/video/detail/:id',video.video_detail);
app.post('/video/edit/:id',video.edit_video);
app.get('/video/delete/:id',video.delete_video);
app.post('/video/search/',video.search);
app.post('/video/count/',video.search_count);


///Hone Slide
app.get('/homeslide/',homeslide.homeslide);
app.post('/homeslide/',homeslide.save);
app.get('/homeslide/detail/:id',homeslide.homeslide_detail);
app.post('/homeslide/edit/:id',homeslide.edit_homeslide);
app.get('/homeslide/delete/:id',homeslide.delete_homeslide);
app.post('/homeslide/search/',homeslide.search);
app.post('/homeslide/count/',homeslide.search_count);

//app.use(app.router);
http.createServer(app).listen(app.get('port'), function(){
  	console.log('Express server listening on port ' + app.get('port'));
  	cron.scheduleJob('00 13 * * 0-7', function(){	
	//cron.scheduleJob('57 10 * * 1-7', function(){	
		console.log(new Date(), "Cron Job - Auto Recap !.");					
		daily.new();
	});
});

