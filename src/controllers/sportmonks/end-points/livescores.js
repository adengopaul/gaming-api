const fetch = require('node-fetch');
const db = require('../../../models/mongodb'); 
const collection = db.collection('livescores');

const scoresUrl = `https://soccer.sportmonks.com/api/v2.0/livescores?api_token=${process.env.API_TOKEN}`;
const inPlayUrl = `https://soccer.sportmonks.com/api/v2.0/livescores/now?api_token=${process.env.API_TOKEN}`;
const leagues = /*'2, 5,2286, 8,24, 27, 564, 570, 82, 109, 384, 390, 301, 307,*/' 501, 513, 271, 1659,';
const include = 'probability';

getAllLivescores = () => {
    fetch(scoresUrl, {
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
    fetch(`${inPlayUrl}&leagues=${leagues}&include=${include}`, {
            method: 'get',
            headers: { 
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
        .then(async (json) => {
            console.log(json.data)
            // const result = await collection.insertMany(json.data).catch(err => console.log(err));
        });

}

// getAllLivescores();
getAllInplayLivescores();