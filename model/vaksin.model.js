const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    db = require('../config/db').db;
uniqueValidator = require('mongoose-unique-validator');
const Common = require('../config/common');
const moment = require('moment-timezone');
autoIncrement.initialize(db);

var Vaksin = new Schema({
    nama: String,  
    tgl_lahir: {
        type: Date
    },
    umur:{
        type:String
    },
    kelompok:{ //-> Guru, Nakes, Lansia, Wartawan, Masyarakat
        type: String,
        default: "-"
    }, 
    jenis_kelamin:String,
    kecamatan:String,
    kelurahan:String,
    alamat: {
        type: String,
        default: "-"
    },
    phone: {
        type: String,
        sparse: true,
        default: "-"
    },
    date_add: {
        type: Date,
        default: new Date()
    },
    add_by: {
        _id:false,
        type: String
    },    
    date_updated: {
        type: Date,
        default: new Date()
    },
    faskes_vaksinasi:{
        type: String,
        default: "-"
    },
    tgl_vaksinasi1: {
        type: Date
    },
    tgl_vaksinasi2: {
        type: Date
    }
});

Vaksin.plugin(autoIncrement.plugin, {
    model: 'vaksin',
    field: '_id'
});
Vaksin.plugin(uniqueValidator);

Vaksin.statics = {
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
                this.find(query, callback).sort({date_add: -1}).skip(skip).limit(limit);     
            }
        } else {
            if(query.sort){
                var sort = query.sort;
                delete query.sort;
                this.find(query, callback).sort(sort);
            } else {
                this.find(query, callback).sort({date_add: -1});     
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
        var vaksin = new this(data);
        vaksin.save(callback);
    },
    multiCount:function(query, callback) {
       this.aggregate(query,callback );
    },
};
Vaksin.index({ lokasi: '2dsphere' });
var vaksin = mongoose.model('vaksin', Vaksin);

/** export schema */
module.exports = {
    Vaksin: vaksin
};