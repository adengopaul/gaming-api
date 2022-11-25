const fetch = require('node-fetch');
const db = require('../../../models/mongodb'); 
const collection = db.collection('markets');

const url = `https://soccer.sportmonks.com/api/v2.0/markets?api_token=${process.env.API_TOKEN}`;

getAllMarkets = () => {
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

getAllMarkets();