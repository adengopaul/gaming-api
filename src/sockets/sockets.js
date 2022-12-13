const { Server } = require("socket.io");

module.exports = {
    connectSocket: function (httpServer) {
        const io = new Server(httpServer, { 
        	cors: {
			    origin: [/*"http://my-frontend.com", */"http://localhost:4200"],
			    // credentials: true
			  }
        });
        io.of('/bookie').on('connection', require('./namespaces/bookie').bookie);
        io.of('/bettor').on('connection', require('./namespaces/bettor').bettor);
    }
}