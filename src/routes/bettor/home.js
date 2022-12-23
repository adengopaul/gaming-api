var express = require('express');
var homeRoutes = express.Router();
const dbo = require('../../db/conn'); 

homeRoutes.route('/home/fixtures').get(async (req, res) => {
	const Fixtures = dbo.getDb().collection('fixtures');
    const Teams = dbo.getDb().collection('teams');

    try {
        const {skip, size} = req.query;
        const fixtures = await Fixtures.aggregate([
        		{$sort: {total: -1}},
        		{$project: {league_id: 1, time: 1, scores:1, localteam_id: 1, visitorteam_id: 1, winner_team_id: 1}},
	            {$skip: parseInt(skip)},
	            {$limit: parseInt(size)}
        	]).toArray();

        let visitorteam_ids = fixtures.map(f => f.visitorteam_id);
        let localteam_ids = fixtures.map(f => f.localteam_id);
        let team_ids = [... new Set([...visitorteam_ids, ...localteam_ids])];

        try {
            const teams = await Teams.find({_id: {$in: team_ids}})
                .project({logo_path: 1, name: 1, short_code: 1}).toArray();
            return res.status(200).json({teams, fixtures});
        } catch (error) {
            
        }
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
});

homeRoutes.route('/home/wagers').get(async(req, res) => {
    console.log(req.query)
	const Fixtures = dbo.getDb().collection('fixtures');
    const Teams = dbo.getDb().collection('teams');
    const Wagers = dbo.getDb().collection('wagers');

	try{
		const {skip, size} = req.query;
		const wagers = await Wagers.aggregate([
        		{$sort: {total: -1}},
	            {$skip: parseInt(skip)},
	            {$limit: parseInt(size)}
        	]).toArray();

        console.log(wagers)
		var fixtureIds = wagers.map(w => w.fixture);
		const fixtures = await Fixtures.find({_id: {$in: fixtureIds}})
			.project({league_id: 1, time: 1, scores:1, localteam_id: 1, visitorteam_id: 1, winner_team_id: 1})
			.toArray();

		var visitorteam_ids = fixtures.map(f => f.visitorteam_id);
        var localteam_ids = fixtures.map(f => f.localteam_id);
        var team_ids = [... new Set([...visitorteam_ids, ...localteam_ids])];
        const teams = await Teams.find({_id: {$in: team_ids}})
                .project({logo_path: 1, name: 1, short_code: 1}).toArray();
        console.log({teams, fixtures, wagers})
        res.status(200).json({teams, fixtures, wagers});
	} catch(error){
        console.log(error)
		res.status(500).json(error);
	}
});


module.exports = homeRoutes;