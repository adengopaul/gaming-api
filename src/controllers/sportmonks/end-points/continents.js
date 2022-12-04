const fetch = require('node-fetch');
const dbo = require('../../../db/conn'); 
const url = `https://soccer.sportmonks.com/api/v2.0/continents?api_token=${process.env.API_TOKEN}`;

getAllContinents = () => {
    const Continents = dbo.getDb().collection('continents');
    fetch(url, {
            method: 'get',
            headers: { 
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
        .then((json) => {
            json.data.map(continent => continent['_id'] = continent.id);

            json.data.forEach(async continent => {
                try {
                    await Continents.updateOne({id: continent.id}, { $set: continent}, {upsert: true});
                } catch (error) {
                    console.log(error)
                }
            });
        });

} 

getAllContinents();