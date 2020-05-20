const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    db = require('../config/db').db;
uniqueValidator = require('mongoose-unique-validator');
const Common = require('../config/common');
const moment = require('moment-timezone');
autoIncrement.initialize(db);

var GugusTugas = new Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    active: {
        type:Number,
        default:0
    },
    level: String,
    phone: {
        type: String,
        unique: true,
        sparse: true
    },
    date_add: {
        type: Date,
        default: new Date()
    },    
    token: String,
    photo: String,
    keterangan: {
        type: String,
        default: "-"
    }
});

GugusTugas.plugin(autoIncrement.plugin, {
    model: 'gugus_tugas',
    field: '_id'
});
GugusTugas.plugin(uniqueValidator);

GugusTugas.statics = {
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

var gugus_tugas = mongoose.model('gugus_tugas', GugusTugas);

/** export schema */
module.exports = {
    GugusTugas: gugus_tugas
};