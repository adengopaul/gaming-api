const fetch = require('node-fetch');
const dbo = require('../../../db/conn'); 

const url = (season_ID) => {
    return `https://soccer.sportmonks.com/api/v2.0/teams/season/${season_ID}?api_token=${process.env.API_TOKEN}`
};

getTeamsBySeasonId = async () => {
    const Teams = dbo.getDb().collection('teams');
    const Leagues = dbo.getDb().collection('leagues');
    try {
        const leagues = await Leagues.find()
            .project({current_season_id: 1})
            .toArray();
        leagues.forEach(league => {
            try {
                fetch(url(league.current_season_id), {
                    method: 'get',
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                }).then(res => res.json())
                .then(async (json) => {
                    if(!json.data) return;
                    console.log(json.data)
                    try {
                        json.data.forEach(async team => {
                            team['_id'] = team.id
                            try {
                                await Teams.updateOne({id: team.id}, { $set: team}, {upsert: true});
                            } catch (error) {
                                console.log(error)
                            }
                        }); 
                    } catch (error) {
                        console.log(error)
                    }
                });
            } catch (error) {
                console.log(error)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

getTeamsBySeasonId();