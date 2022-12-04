const fetch = require('node-fetch');
const dbo = require('../../../db/conn');  

const url = `https://soccer.sportmonks.com/api/v2.0/markets?api_token=${process.env.API_TOKEN}`;

getAllMarkets = () => {
    const collection = dbo.getDb().collection('markets');
    fetch(url, {
            method: 'get',
            headers: { 
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
        .then((json) => {
            // console.log(json)
            json.data.map(market => market['_id'] = market.id)
            json.data.forEach(async market => {
                try {
                    await collection.updateOne({id: market.id}, { $set: market}, {upsert: true});
                } catch (error) {
                    console.log(error)
                }
            }); 
        });
}

getAllMarkets();