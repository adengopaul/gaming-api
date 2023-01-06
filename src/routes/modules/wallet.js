const express = require('express');
const walletRoutes = express.Router();
const checkAuth = require('../check-auth');
const dbo = require('../../db/conn'); 
const fetch = require('node-fetch');

const momoUrl = `https://sandbox.momodeveloper.mtn.com/`;

walletRoutes.route('/wallet/balance', checkAuth ).get();

walletRoutes.route('/wallet/deposit', checkAuth).post((req, res) => {
    const body = {
        "amount": "900.0",
        "currency": "EUR",
        "externalId": "097411065",
        "payer": {
          "partyIdType": "MSISDN",
          "partyId": "260962217114"
        },
        "payerMessage": "Sure thing!",
        "payeeNote": "Payback my money bro!"
      };
      
    const requestToPay = async () => {
        try{
            let result = await fetch(`${momoUrl}collection/v1_0/requesttopay`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': process.env.Ocp_Apim_Subscription_Key,
                    'X-Target-Environment': 'sandbox',
                    'Authorization': `Bearer ${global.momoBearerToken}`,
                    'X-Reference-Id': process.env.X_Reference_Id
                },
                body: JSON.stringify(body)
            });

            if(!result.ok) throw  result;
            let json = result.json();
            console.log(json);
            res.status(200).json({msg: 'Success'});
        } catch(error){
            res.status(error.status).json({message: error.statusText});
        }
    }

    requestToPay();
});

module.exports = walletRoutes;