const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    db = require('../config/db').db;
uniqueValidator = require('mongoose-unique-validator');
const Common = require('../config/common');
const moment = require('moment-timezone');
autoIncrement.initialize(db);

var QRCode = new Schema({
    qrcode: {
        type: String,
        unique: true,
        required: true
    },
    date_add: {
        type: Date,
        default: new Date()
    },
    filename: String,
    active: {
        type:Number,
        default:0
    }
});

QRCode.plugin(autoIncrement.plugin, {
    model: 'qrcode',
    field: '_id'
});
QRCode.plugin(uniqueValidator);

QRCode.statics = {
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
                this.find(query, callback).skip(skip).limit(limit);     
            }
        } else {
            if(query.sort){
                var sort = query.sort;
                delete query.sort;
                this.find(query, callback).sort(sort);
            } else {
                this.find(query, callback);     
            }
        }
    },

    getCount: function(query, callback) {
        this.count(query, callback);
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
    },
    saveAll: function( docs, callback){
        var count = 0;
        var collect =  this;
        docs.forEach(function(data){
            var doc = new collect(data);
            doc.save(function(err){
                count++;
                if( count == docs.length ){
                    callback();
                }
            });
        });
    }
};

var qrcode = mongoose.model('qrcode', QRCode);

/** export schema */
module.exports = {
    QRCode: qrcode
};