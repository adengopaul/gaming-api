const jwt = require('jsonwebtoken');

exports.auth = (socket, next) => {
    let token = socket.handshake.query.token;
    
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            socket.handshake.user = decoded;
            return next();
        } catch (error) {
            next(new Error('authentication error' + err));
        }
    }
}