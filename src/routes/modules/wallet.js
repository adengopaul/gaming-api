const express = require('express');
const walletRoutes = express.Router();
const checkAuth = require('../check-auth');
const dbo = require('../../db/conn'); 
const fetch = require('node-fetch');
const generateUuid = require('../../functions/strings').generateUuid;
const momoUrl = `https://sandbox.momodeveloper.mtn.com/`;

walletRoutes.route('/wallet/balance', checkAuth ).get();

// Request to Pay service is used for requesting a payment from a customer (Payer)
walletRoutes.route('/wallet/deposit', checkAuth).post((req, res) => {
    const body = {
        "amount": "900.0",
        "currency": "EUR",
        "externalId": "097411065",
        "payer": {
          "partyIdType": "MSISDN",
          "partyId": "256751648404"
        },
        "payerMessage": "Sure thing!",
        "payeeNote": "Payback my money bro!"
      };
      
    const requestToPay = async () => {
        let transactionId = generateUuid();
        try{
            let result = await fetch(`${momoUrl}collection/v1_0/requesttopay`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': process.env.Ocp_Apim_Subscription_Key,
                    'X-Target-Environment': 'sandbox',
                    'Authorization': `Bearer ${global.momoBearerToken}`,
                    'X-Reference-Id': transactionId,
                    // 'X-Callback-Url': `http://localhost:3000/wallet/requesttopay`
                },
                body: JSON.stringify(body)
            });
 
            if(result.status >=300) throw  {status: result.status, message: result.statusText};
            res.status(result.status).json({msg: result.statusText});
        } catch(error){
            res.status(error.status? error.status: 500).json({message: error.message});
        }
    }

    requestToPay();
});

// Pre-approval is used to setup an auto debit towards a customer
walletRoutes.route('/wallet/pre-approval', checkAuth).post((req, res) => {});

// Transfer is used for transferring money from the provider account to a customer.
walletRoutes.route('/wallet/pre-approval', checkAuth).post((req, res) => {});

// Validate account holder can be used to do a validation if a customer is active and able to receive funds.
walletRoutes.route('/wallet/validate-account', checkAuth).post((req, res) => {});

// Get balance request is used to check the balance on the default account connected to the API User.
walletRoutes.route('/wallet/get-balance', checkAuth).post((req, res) => {});

// Callback URL
walletRoutes.route('/wallet/request-to-pay', checkAuth).post((req, res) => {
    console.log(req.body);
    res.status(200).json({message: 'Success'});
})

module.exports = walletRoutes;