var express = require('express');
var fixtureRoutes = express.Router();

const dbo = require('../../db/conn'); 

fixtureRoutes.route('/fixtures').get( async (req, res) => {
    const Fixtures = dbo.getDb().collection('fixtures');
    const Teams = dbo.getDb().collection('teams');
   
    try {
        const fixtures = await Fixtures.find()
            .project({league_id: 1, time: 1, scores:1, localteam_id: 1, visitorteam_id: 1, winner_team_id: 1})
            .toArray();
        let visitorteam_ids = fixtures.map(f => f.visitorteam_id);
        let localteam_ids = fixtures.map(f => f.localteam_id);
        let team_ids = [... new Set([...visitorteam_ids, ...localteam_ids])];

        try {
            const teams = await Teams.find({_id: {$in: team_ids}})
                .project({logo_path: 1, name: 1, short_code: 1}).toArray();
                console.log(fixtures.length, teams.length, team_ids.length)
            return res.status(200).json({teams, fixtures});
        } catch (error) {
            
        }
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
});

module.exports = fixtureRoutes;