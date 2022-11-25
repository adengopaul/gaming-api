const fetch = require('node-fetch');
const db = require('../../../models/mongodb'); 
const collection = db.collection('livescores');

const url = `https://soccer.sportmonks.com/api/v2.0/livescores?api_token=${process.env.API_TOKEN}`;
const url2 = `https://soccer.sportmonks.com/api/v2.0/livescores/now?api_token=${process.env.API_TOKEN}`;

getAllLivescores = () => {
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

getAllInplayLivescores = () => {
    fetch(url2, {
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

getAllLivescores();
getAllInplayLivescores();