const fetch = require('node-fetch');
const db = require('../../../models/mongodb'); 
const collection = db.collection('leagues');
const url = (ID) => {
    return `https://soccer.sportmonks.com/api/v2.0/leagues/${ID}?api_token=${process.env.API_TOKEN}`;
}

const leagueIDs = [
    // 2, 5,2286,  // Europe
    // 8,24, 27, // UK
    // 564, 570, // Spain
    // 82, 109, // Germany
    // 384, 390, // Italy
    // 301, 307, // France
    501, 513, // Scotland
    271, 1659, // Denmark
];

getLeaguesByID = () => {
    leagueIDs.forEach( async id => {
        try {
            fetch(url(id), {
                method: 'get',
                headers: { 
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json())
            .then(async (json) => {
                console.log(json.data);
                if(!json.data) return;
                try {
                    json.data['_id'] = id;
                    const result = await collection.updateOne({id: id}, { $set: json.data}, {upsert: true});
                } catch (error) {
                    console.log(error)
                }
            });
        } catch (error) {
            console.log(error)
        }
        
    });
} 

getLeaguesByID();