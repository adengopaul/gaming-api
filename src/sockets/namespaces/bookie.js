const dbo = require('../../db/conn'); 

module.exports.bookie = (socket) => {
	let user = socket.handshake.user;
    const Fixtures = dbo.getDb().collection('fixtures');
    const Teams = dbo.getDb().collection('teams');
    const Wagers = dbo.getDb().collection('wagers');

    socket.on('get_fixtures', async (req) => {
    	try {
	        const fixtures = await Fixtures.aggregate([
		            {$skip: req.skip},
		            {$limit: req.size},
		            {$project: {
		            	league_id: 1, 
		            	time: 1, scores:1, 
		            	localteam_id: 1, 
		            	visitorteam_id: 1, 
		            	winner_team_id: 1}}
	        	]).toArray();
	        
	        var fixtureIds = fixtures.map(f => f._id);
	        var visitorteam_ids = fixtures.map(f => f.visitorteam_id);
	        var localteam_ids = fixtures.map(f => f.localteam_id);
	        var team_ids = [... new Set([...visitorteam_ids, ...localteam_ids])];

	        try {
	            const teams = await Teams.find({_id: {$in: team_ids}})
	                .project({logo_path: 1, name: 1, short_code: 1}).toArray();
	            const wagers = await Wagers.find({fixture: {$in: fixtureIds}}).toArray();
	            socket.emit('fixtures_list', {teams, fixtures, wagers});
	            
	            Fixtures.watch([
	                { $match: { 
	                    'fullDocument._id': {$in: fixtureIds},
	                    "operationType": {
	                        "$in": [
	                          "update"
	                        ]
	                      } 
	                }}
	            ], {fullDocument: 'updateLookup'}).on('change', (e) => {
	                console.log(e);
	            })
	        } catch (error) {
	            
	        }
	    } catch (error) {
	        console.log(error)
	        socket.emit('error', error);
	    } 
    });

    socket.on('save_wagers', async (wager) => {
    	try{
    		delete wager['_id'];
            await Wagers.updateOne({id: wager.id}, { $set: wager}, {upsert: true});   
    	} catch (error) {
	        console.log(error)
	        socket.emit('error', error);
	    } 
    });
}