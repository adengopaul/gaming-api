exports.setPassword = function (password) {
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return {salt, hash};
};

exports.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

exports.generateJwt = function(payload) {    
    return jwt.sign( payload, process.env.JWT_SECRET, {expiresIn: "7d"} );
};