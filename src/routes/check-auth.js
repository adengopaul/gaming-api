const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    var token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.auth = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Auth failed.'})
    }
}