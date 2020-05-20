const Mongoose = require('mongoose');
const config = require('./config');
Mongoose.Promise = global.Promise;

Mongoose.connect(config.database.url, (err, db) => {
    if (err) {
        console.log('err', err);
    }
    // else { console.log('Connected', db)}

});
const db = Mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error'));
db.on('error', function callback(err) {
    console.log("Connection Error "+err);
});
db.once('open', function callback() {
    console.log("Connection with database succeeded.");
});

exports.db = db;
