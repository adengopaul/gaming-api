var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();
var mobileMoney = require('../src/models/mobileMoney');

router.get('/', async (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/', async (req, res) => {
    var headers = {}
    var body = {}
    const response = await fetch(`${mobileMoney.airtelMoney}/merchant/v1/payments/`, {
        method: 'POST', 
        body: JSON.stringify(body),
	    headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();

    console.log(data);
    res.status(200).json(data);
});

module.exports = router;
