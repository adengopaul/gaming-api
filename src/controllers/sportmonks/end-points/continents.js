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
        .then(async (json) => {
            json.data.map(continent => continent['_id'] = continent.id)
            try {
                await collection.insertMany(json.data);
            } catch (error) {
                console.log(error)
            }   
        });

} 

getAllContinents();