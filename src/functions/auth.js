var crypto = require('crypto');
var jwt = require('jsonwebtoken');

exports.setPassword = function (password) {
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return {salt, hash};
};

exports.validPassword = function (salt, hash, password) {
    var newHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return newHash === hash;
};

exports.generateJwt = function(payload) {    
    return jwt.sign( payload, process.env.JWT_SECRET, {expiresIn: "7d"} );
};