const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    db = require('../config/db').db;
uniqueValidator = require('mongoose-unique-validator');
const Common = require('../config/common');
const moment = require('moment-timezone');
autoIncrement.initialize(db);

var Tes = new Schema({
    nama: String,  
    tgl_lahir: {
        type: Date
    },
    umur:{
        type:String
    },
    jenis:String, //->"Tes PCR","Tes TCM","Tes Reagen Antigen"
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
    faskes:{
        type: String,
        default: "-"
    },
    hasil:{
        type: String
    },
    tgl_tes: {
        type: Date
    },
    kode_import:{
        type: String
    }
});

Tes.plugin(autoIncrement.plugin, {
    model: 'tes',
    field: '_id'
});
Tes.plugin(uniqueValidator);

Tes.statics = {
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
        var tes = new this(data);
        tes.save(callback);
    },
    multiCount:function(query, callback) {
       this.aggregate(query,callback );
    },
};
Tes.index({ lokasi: '2dsphere' });
var tes = mongoose.model('tes', Tes);

/** export schema */
module.exports = {
    Tes: tes
};