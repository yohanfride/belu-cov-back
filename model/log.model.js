const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    db = require('../config/db').db;
uniqueValidator = require('mongoose-unique-validator');
const Common = require('../config/common');
const moment = require('moment-timezone');
autoIncrement.initialize(db);

var Log = new Schema({
    date_add: {
        type: Date,
        default: new Date()
    },
    iduser:String,
    lokasi: {
       type: { type: String },
       coordinates: [Number]
    },
    nama:String,
    phone:String,
    kondisi:String,
    level:String,
    level_status:String,
    qrcode: String,
    kecamatan:String,
    kelurahan:String,
});

Log.plugin(autoIncrement.plugin, {
    model: 'log',
    field: '_id'
});
Log.plugin(uniqueValidator);

Log.statics = {
    firstInstall: function (requestData, callback) {
        this.create(requestData, callback);
    },

    get: function(query, callback) {
        this.findOne(query, callback);
    },

    getAll: function(query, callback) {
        if(query.limit){
            var limit = parseInt(query.limit);
            delete query.limit;
            if(!query.skip){ 
                var skip = 0; 
            } else {
                var skip = parseInt(query.skip);
                delete query.skip;
            }
            
            if(query.sort){
                var sort = query.sort;
                delete query.sort;
                this.find(query, callback).sort(sort).skip(skip).limit(limit);
            } else {
                this.find(query, callback).skip(skip).limit(limit).sort({'date_add':-1});     
            }
        } else {
            if(query.sort){
                var sort = query.sort;
                delete query.sort;
                this.find(query, callback).sort(sort);
            } else {
                this.find(query, callback).sort({'date_add':-1});     
            }
        }
    },

    getCount: function(query, callback) {
        if(query.limit){
            var limit = query.limit;
            delete query.limit;
            if(!query.skip){ 
                var skip = 0; 
            } else {
                var skip = query.skip;
                delete query.skip;
            }
            this.find(query, callback).skip(skip).limit(limit).count(); 
        } else {
            this.count(query, callback);
        }
        
    },

    updateById: function(id, updateData, callback) {
        this.update(id, {$set: updateData}, callback);
    },
    updateByIdAdd: function(id, updateData, callback) {
        this.update(id, {$set: updateData},{upsert:false,multi:true}, callback);
    },
    removeById: function(removeData, callback) {
        this.remove(removeData, callback);
    },
    create: function(data, callback) {
        var user = new this(data);
        user.save(callback);
    }
};

var log = mongoose.model('log', Log);

/** export schema */
module.exports = {
    Log: log
};