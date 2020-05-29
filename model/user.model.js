const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    db = require('../config/db').db;
uniqueValidator = require('mongoose-unique-validator');
const Common = require('../config/common');
const moment = require('moment-timezone');
autoIncrement.initialize(db);

var User = new Schema({
    qrcode: {
        type: String,
        default: ""
        //,unique: true
        //,required: true
    },
    level:{
        type: String,
        default: "-"
    },
    level_status:{
        type: String,
        default: "-"
    },
    nama: String,
    tgl_lahir: {
        type: Date
    },
    umur:{
        type:String
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
    riwayat_perjalanan:{
        type: String,
        default: "-"
    },
    keluhan:{
        type: String,
        default: "-"
    },
    date_add: {
        type: Date,
        default: new Date()
    },
    date_end: {
        type: Date
    },
    lokasi: {
       type: { type: String },
       coordinates: [Number]
    },
    add_by: {
        _id:false,
        type: String
    },    
    date_updated: {
        type: Date,
        default: new Date()
    },
    status_pantau:{
        type:Number,
        default:1
    },
    kode_import:{
        type: String
    },
    puskesmas:{
        type: String,
        default: "-"
    }
});

User.plugin(autoIncrement.plugin, {
    model: 'user',
    field: '_id'
});
User.plugin(uniqueValidator);

User.statics = {
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
    },
    multiCount:function(query, callback) {
       this.aggregate(query,callback );
    },
};
User.index({ lokasi: '2dsphere' });
var user = mongoose.model('user', User);

/** export schema */
module.exports = {
    User: user
};