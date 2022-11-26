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

main = async () => {
    try {
        await client.connect();
        console.log('mongodb connected to atlas' /*+ dbURI*/);
        module.exports = client.db();
        require('../controllers/sportmonks/sportmonks');
    } catch (error) {
        console.log(error);
        console.log("mongodb not connected");
    }
}

main();


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