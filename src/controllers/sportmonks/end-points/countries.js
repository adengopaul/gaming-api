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
        .then(async (json) => {
            json.data.map(country => country['_id'] = country.id);
            try {
                await collection.insertMany(json.data);
            } catch (error) {
                console.log(error)
            }   
        });

} 

getAllCountries();