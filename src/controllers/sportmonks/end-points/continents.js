const fetch = require('node-fetch');
const db = require('../../../models/mongodb'); 
const collection = db.collection('continents');
const url = `https://soccer.sportmonks.com/api/v2.0/continents?api_token=${process.env.API_TOKEN}`;

getAllContinents = () => {
    fetch(url, {
            method: 'get',
            headers: { 
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
        .then((json) => {
            json.data.map(continent => continent['_id'] = continent.id);

            json.data.forEach(async continent => {
                try {
                    await collection.updateOne({id: continent.id}, { $set: continent}, {upsert: true});
                } catch (error) {
                    console.log(error)
                }
            });
        });

} 

getAllContinents();