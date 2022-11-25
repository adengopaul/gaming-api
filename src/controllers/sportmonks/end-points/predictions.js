const fetch = require('node-fetch');
const db = require('../../../models/mongodb'); 
const collection = db.collection('predictions');

const url = `https://soccer.sportmonks.com/api/v2.0/predictions/leagues?api_token=${process.env.API_TOKEN}`;
const url2 = `https://soccer.sportmonks.com/api/v2.0/predictions/probabilities/next?api_token=${process.env.API_TOKEN}`;
const url3 = `https://soccer.sportmonks.com/api/v2.0/predictions/valuebets/next?api_token=${process.env.API_TOKEN}`;

getLeaguesAndPerformances = () => {
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

getProbabilities = () => {
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

getValueBets = () => {
    fetch(url3, {
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

getLeaguesAndPerformances();
getProbabilities();
getValueBets();