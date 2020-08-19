const Mongoose = require('mongoose');
const config = require('./config');
Mongoose.Promise = global.Promise;

// var options = {
//     "auth": {
//       "authSource": "cov-sampang"
//     },
//     "user": config.database.username,
//     "pass": config.database.password
//   };

// Mongoose.connect(config.database.url,options, (err, db) => {
//     if (err) {
//         console.log('err', err);
//     }
//     // else { console.log('Connected', db)}

// });
Mongoose.connect(config.database.url,(err, db) => {
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
