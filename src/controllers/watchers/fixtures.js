const dbo = require('../../db/conn'); 

const Fixtures = dbo.getDb().collection('fixtures');
Fixtures.watch([
    { $match: { 
        // 'fullDocument.time.status': user.uid,
        "operationType": {
            "$in": [
              "update"
            ]
          } 
    }}
], {fullDocument: 'updateLookup'}).on('change', (e) => {
    console.log(e);
})
// watchFulltime = () =
// fixture.time?.status == 'FT