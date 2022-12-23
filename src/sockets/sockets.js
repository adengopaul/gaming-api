const { Server } = require("socket.io");
var checkAuth = require('./check-auth');

module.exports = {
    connectSocket: function (httpServer) {
        const io = new Server(httpServer, { 
        	cors: {
			    origin: [/*"http://my-frontend.com", */"http://localhost:4200"],
			    // credentials: true
			  }
        });
        io.of('/bookie').use(checkAuth.auth).on('connection', require('./namespaces/bookie').bookie);
        io.of('/bettor').use(checkAuth.auth).on('connection', require('./namespaces/bettor').bettor);
    }
}