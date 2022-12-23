const dbo = require('../../db/conn'); 

module.exports.bettor = (socket) => {
	let user = socket.handshake.user;
	const Fixtures = dbo.getDb().collection('fixtures');
    const Teams = dbo.getDb().collection('teams');
    const Wagers = dbo.getDb().collection('wagers');

    socket.on('get_wagers', async(req) => {
    	try{
    		const wagers = await Wagers.aggregate([
	        		{$sort: {total: -1}},
		            {$skip: req.skip},
		            {$limit: req.size}
	        	]).toArray();

    		var fixtureIds = wagers.map(w => w.fixture);
    		const fixtures = await Fixtures.find({_id: {$in: fixtureIds}}).toArray();

    		var visitorteam_ids = fixtures.map(f => f.visitorteam_id);
	        var localteam_ids = fixtures.map(f => f.localteam_id);
	        var team_ids = [... new Set([...visitorteam_ids, ...localteam_ids])];
	        const teams = await Teams.find({_id: {$in: team_ids}})
	                .project({logo_path: 1, name: 1, short_code: 1}).toArray();
	        socket.emit('wagers_list', {teams, fixtures, wagers});
    	} catch(error){
    		socket.emit('error', error);
    	}
    })

}