const mongoose = require('mongoose');

var dbURI;
var dbName;

// set variable NODE_ENV in heroku to production
dbName = process.env.NODE_ENV === 'production'? 'gaming': 'gaming-test';
// dbName = 'reportking';
// dbURI = `mongodb+srv://adengo:${process.env.DB_PASS}@cluster0.kxm0wkf.mongodb.net/${dbName}?retryWrites=true&w=majority`;
dbURI =`mongodb+srv://adengo:EYgrWIEwt86upw9G@cluster0.6sfvi.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const options = {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    autoIndex: false
}

mongoose.connect(dbURI, options).then((result)=>{

    console.log('Mongoose connected to atlas' /*+ dbURI*/);
    //console.log(result);

    return result;
    }).catch((error)=>{
    console.log("mongodb not connected");
    // console.log(error);
});

gracefulShutdown = function(msg, callback){
    mongoose.connection.close(function(){
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
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