var express = require('express');
var smsRoutes = express.Router();
const dbo = require('../../db/conn');

smsRoutes.route('/incoming-messages').post( async(req, res) => {
    const SMS = dbo.getDb().collection('sms');
    const data = req.body;
    console.log(`Received message: \n ${data}`);
    try {
        await SMS.insertOne(data);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
    
});

module.exports = smsRoutes;