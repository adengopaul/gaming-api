var express = require('express');
var fixtureRoutes = express.Router();

const dbo = require('../../db/conn'); 

fixtureRoutes.route('/fixtures').get( async (req, res) => {
    const collection = dbo.getDb().collection('fixtures');
   
    try {
        const fixtures = await collection.find().project({league_id: 1}).toArray();
        res.status(200).json(fixtures);
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
});

module.exports = fixtureRoutes;