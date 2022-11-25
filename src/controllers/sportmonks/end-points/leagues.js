const fetch = require('node-fetch');
const db = require('../../../models/mongodb'); 
const collection = db.collection('leagues');
const url = (ID) => {
    return `https://soccer.sportmonks.com/api/v2.0/leagues/${ID}?api_token=${process.env.API_TOKEN}`;
}

const leagueIDs = [
    2, 5,2286,  // Europe
    8,24, 27, // UK
    564, 570, // Spain
    82, 109, // Germany
    384, 390, // Italy
    301, 307, // France
];

getLeaguesByID = () => {
    leagueIDs.forEach( async id => {
        try {
            const league = await collection.findOne({_id: id});
            if(!league){
                fetch(url(id), {
                    method: 'get',
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                }).then(res => res.json())
                .then(async (json) => {
                    console.log(json.data);
                    // try {
                    //     json.data['_id'] = json.data.id;
                    //     const result = await collection.insertOne(json.data);
                    // } catch (error) {
                    //     console.log(error)
                    // }
                });
            }
        } catch (error) {
            console.log(error)
        }
        
    });
} 

getLeaguesByID();