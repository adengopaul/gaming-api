const fetch = require('node-fetch');
const db = require('../../../models/mongodb'); 
const collection = db.collection('fixtures');
const url = 'https://soccer.sportmonks.com/api/v2.0/fixtures';
const leagues = /*'2, 5,2286, 8,24, 27, 564, 570, 82, 109, 384, 390, 301, 307,*/' 501, 513, 271, 1659,';

getFixturesByDate = () => {
    const now = Date.now();
    const then = now + (14*24*60*60*1000);
    const getDate = (timestamp) => {
        return `${new Date(timestamp).getFullYear()}-${new Date(timestamp).getMonth()}-${new Date(timestamp).getDate()}`;
    }

    // console.log(getDate(now), getDate(then));
    const params = [ 
        `api_token=${process.env.API_TOKEN}`, 
        `leagues=${leagues}`,
        `include=probability`
    ]

    fetch(`${url}/between/${getDate(now)}/${getDate(then)}?${params[0]}&${params[1]}`, {
            method: 'get',
            // body:    JSON.stringify(body),
            headers: { 
                'Content-Type': 'application/json',
                // 'Authorization': 'f086646adaa14eea8220e19680ed6abc516d70b01576483a82940b40e421f54b'
            },
        }).then(res => res.json())
        .then( (json) => {
            // console.log(json)
            if(!json.data) return;
            json.data.forEach(async fixture => {
                try {
                    fixture['_id'] = fixture.id;
                    await collection.updateOne({id: fixture.id}, { $set: fixture}, {upsert: true});
                } catch (error) {
                    console.log(error)
                }
            });
        });

} 

getFixturesByDate();

getLastUpdatedFixtures = () => {
    fetch(`${url}/fixtures/updates?api_token=${process.env.API_TOKEN}`, {
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
// getLastUpdatedFixtures();