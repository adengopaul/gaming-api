const fetch = require('node-fetch');
const db = require('../../../models/mongodb'); 
const collection = db.collection('seasons');
const url = `hhttps://soccer.sportmonks.com/api/v2.0/seasons?api_token=${process.env.API_TOKEN}`;

getAllSeasons = () => {
    fetch(url, {
            method: 'get',
            headers: { 
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
        .then(async (json) => {
            // console.log(result)
            const result = await collection.insertMany(json.data).catch(err => console.log(err));
        });

} 

getAllSeasons();