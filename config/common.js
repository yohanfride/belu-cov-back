'use strict';
const nodemailer = require("nodemailer")
const Config = require('./config')
const crypto = require('crypto')
const algorithm = 'aes-256-ctr'
const privateKey = Config.key.privateKey;
const Jwt = require('jsonwebtoken');

// create reusable transport method (opens pool of SMTP connections)
// console.log(Config.email.username+"  "+Config.email.password);
var smtpTransport = nodemailer.createTransport(
    {
        host: Config.email.smtpHost,
        port: Config.email.smtpPort,
        secure: Config.email.smtpSecure,
        auth: {
            user: Config.email.username,
            pass: Config.email.password
        },
        logger: true,
        debug: false // include SMTP traffic in the logs
    },
    {
        // default message fields

        // sender info
        from: 'Pangalink <no-reply@pangalink.net>',
        headers: {
            'X-Laziness-level': 1000 // just an example header, no need to use this
        }
    }
);

exports.decrypt = (password) => {
    return decrypt(password);
};

exports.encrypt = (password) => {
    return encrypt(password);
};

exports.sentMailVerificationLink = (user, token, callback) => {
    Jwt.verify(token, privateKey, (err, decoded) => {
            console.log("decoded : " + JSON.stringify(decoded));
            let type = decoded.tokenData.type;
            if (type == Config.role.super_admin)
                type = Config.role.admin;
            console.log("type : " + type);
            if (!err) {
                var textLink = "http://" + Config.server.host + ":" + Config.server.port + "/" + type.toLowerCase() + "/" + Config.email.verifyEmailUrl + "/" + token;
                textLink += "?token=" + token;
                var from = `Bagol Team<${Config.email.username}>`;
                var mailbody = `<p>Thanks for Registering</p><p>Please verify your email by clicking on the verification link below.<br/><a href=${textLink.toString()}
    >Verification Link</a></p>`;
                console.log("exports.sentMailVerificationLink. token : " + token + "\nfrom : " + from);
                mail(from, user.email, `Account Verification`, mailbody, function (error, success) {
                    callback(error, success)
                });
            }
        }
    );

};

exports.sentMailForgotPassword = (user, callback) => {
    // var textLink = "http://" + Config.server.host + ":" + Config.server.port + "/" + token.type.toLowerCase() + "/" + Config.email.resetEmailUrl + "/" + token;
    var from = `Bagol Team<${Config.email.username}>`;
    var mailbody = '<p>Your new password has been created. Your new password is '/+ user.temp_password +'/</p><br>This password is temporary, will be expired in 2 hours'
    mail(from, user.email, `Account New password`, mailbody, function (error, success) {
        callback(error, success)
    });
};


function decrypt(password) {
    var decipher = crypto.createDecipher(algorithm, privateKey);
    var dec = decipher.update(password, 'hex', 'utf8');
    dec += decipher.final('utf8');
    //coba
    console.log("decrypt " + password + " to be : " + dec);
    return dec;
}

function encrypt(password) {
    var cipher = crypto.createCipher(algorithm, privateKey);
    var crypted = cipher.update(password, 'utf8', 'hex');
    crypted += cipher.final('hex');
    console.log("encrypt " + password + " to be : " + crypted);
    return crypted;
}

function mail(from, email, subject, mailbody, callback) {
    console.log("BOS : mail(from, email, subject, mailbody, callback)");
    var mailOptions = {
        from: from, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        //text: result.price, // plaintext body
        html: mailbody  // html body
    };

    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            callback(error, null)
        }
        else {
            callback(null, response)
        }
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}

exports.randomString = (len) => {
    var text = "";

    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
};

exports.checkRole = (expected, _id) => {
    switch (expected) {
        case "admin":
            break;

        case "barber":
            break;

        case "user":
            break;

    }
}