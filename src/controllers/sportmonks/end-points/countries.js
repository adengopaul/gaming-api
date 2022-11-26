const fetch = require('node-fetch');
const db = require('../../../models/mongodb'); 
const collection = db.collection('countries');
const url = `https://soccer.sportmonks.com/api/v2.0/countries?api_token=${process.env.API_TOKEN}`;

getAllCountries = () => {
    fetch(url, {
            method: 'get',
            headers: { 
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
        .then((json) => {
            json.data.map(country => country['_id'] = country.id);
            json.data.forEach(async country => {
                try {
                    await collection.updateOne({id: country.id}, { $set: country}, {upsert: true});
                } catch (error) {
                    console.log(error)
                }
            }); 
        });

} 

getAllCountries();