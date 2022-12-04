const fetch = require('node-fetch');
const dbo = require('../../../db/conn'); 

const url = `https://soccer.sportmonks.com/api/v2.0/predictions/leagues?api_token=${process.env.API_TOKEN}`;
const url2 = `https://soccer.sportmonks.com/api/v2.0/predictions/probabilities/next?api_token=${process.env.API_TOKEN}`;
const url3 = `https://soccer.sportmonks.com/api/v2.0/predictions/valuebets/next?api_token=${process.env.API_TOKEN}`;

getLeaguesAndPerformances = () => {
    const collection = dbo.getDb().collection('predictions');
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
    const collection = dbo.getDb().collection('predictions');
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
    const collection = dbo.getDb().collection('predictions');
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