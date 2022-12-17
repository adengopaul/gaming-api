const dbo = require('./conn');

createIndexes = async () => {
	const Otps = dbo.getDb().collection('otps');

	try{
		await Otps.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 10*60 } );
	} catch(error){
		console.log(error)
	}
}

createIndexes();