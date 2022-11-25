const fetch = require('node-fetch');
const db = require('../../../models/mongodb'); 
const collection = db.collection('fixtures');

getFixturesByDate = () => {
    fetch(`https://soccer.sportmonks.com/api/v2.0/fixtures/between/2022-08-02/2022-08-10?api_token=${process.env.API_TOKEN}`, {
            method: 'get',
            // body:    JSON.stringify(body),
            headers: { 
                'Content-Type': 'application/json',
                // 'Authorization': 'f086646adaa14eea8220e19680ed6abc516d70b01576483a82940b40e421f54b'
            },
        }).then(res => res.json())
        .then(async (json) => {
            // console.log(result)
            const result = await collection.insertMany(json.data).catch(err => console.log(err));
            console.log(result)
        });

} 

getFixturesByDate();

getLastUpdatedFixtures = () => {
    fetch(`https://soccer.sportmonks.com/api/v2.0/fixtures/updates?api_token=${process.env.API_TOKEN}`, {
            method: 'get',
            // body:    JSON.stringify(body),
            headers: { 
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
        .then(async (json) => {
            // console.log(result)
            const result = await collection.insertMany(json.data).catch(err => console.log(err));
            console.log(result)
        });
} 
getLastUpdatedFixtures();