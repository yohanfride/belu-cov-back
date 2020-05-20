const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    db = require('../config/db').db;
uniqueValidator = require('mongoose-unique-validator');
const Common = require('../config/common');
const moment = require('moment-timezone');
autoIncrement.initialize(db);

var Faskes = new Schema({
    nama:String,
    lokasi: {
       type: { type: String },
       coordinates: [Number]
    },
    alamat:String,
    phone:String
});

Faskes.plugin(autoIncrement.plugin, {
    model: 'faskes',
    field: '_id'
});
Faskes.plugin(uniqueValidator);

Faskes.statics = {
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
    getCor: function(lng,lat,distance, callback) {
        this.find({
            lokasi: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng,lat]
                    },
                    $maxDistance: distance
                }
            }
        }, callback);
    },
    create: function(data, callback) {
        var user = new this(data);
        user.save(callback);
    }
};

Faskes.index({ lokasi: '2dsphere' });
var faskes = mongoose.model('faskes', Faskes);

/** export schema */
module.exports = {
    Faskes: faskes
};