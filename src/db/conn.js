const { MongoClient, ServerApiVersion } = require('mongodb');

var dbURI;
var dbName;
// set variable NODE_ENV in heroku to production
dbName = process.env.NODE_ENV === 'production'? 'gaming': 'gaming-test';

dbURI = `mongodb+srv://adengo:EYgrWIEwt86upw9G@cluster0.6sfvi.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const client = new MongoClient(dbURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    serverApi: ServerApiVersion.v1 
});

let dbConnection = client.db();
module.exports = {
    connectToServer: function (callback) {
      client.connect().then(function (client) {
        dbConnection = client.db();
        console.log("Successfully connected to MongoDB.");
        require('./indexes');
        require('../../src/controllers/sportmonks/sportmonks');
        return callback();
      }, (err) => {   
        return callback(err);
      });
    },
  
    getDb: function () {
      return dbConnection;
    },
  };
  

gracefulShutdown = async (msg, callback) => {
    await client.close();
    console.log('mongodb disconnected through ' + msg);
    callback();
};

// For nodemon restarts
process.once('SIGUSR2', function(){
    gracefulShutdown('nodemon restart', function(){
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function(){
    gracefulShutdown('app termination', function(){
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});