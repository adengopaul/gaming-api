const dbo = require('../../db/conn');
const fetch = require('node-fetch');
const fetchError = require('../../functions/fetchError');
const generateUuid = require('../../functions/strings');

const momoUrl = `https://sandbox.momodeveloper.mtn.com/`;

createAPIUser = async () => {
    console.log('create api user')
    const body = {
        "providerCallbackHost": "https://webhook.site/de55348f-c6e2-4518-bc48-1661f1efeec9"
    };

    try{
        let result = await fetch(`${momoUrl}v1_0/apiuser`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.Ocp_Apim_Subscription_Key,
                'X-Reference-Id': process.env.X_Reference_Id
            },
            body: JSON.stringify(body)
        });

        if(!result.ok) throw  result;
        let json = result.json();
        console.log(json)
    } catch(error){
        console.log(error);
    }
    
}

createAPIKey = async () => {
    try {
        let result = await fetch(`${momoUrl}v1_0/apiuser/${process.env.X_Reference_Id}/apikey`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.Ocp_Apim_Subscription_Key,
                'X-Target-Environment': 'sandbox'
            }
        });

        if(!result.ok) throw  result;
        let json = result.json();
        global.momoApiKey = json.apiKey;

        createBearerToken();
    } catch (error) {
        console.log(error);
    }
}

createBearerToken = async () => {
    let buf = new Buffer.from(`${process.env.X_Reference_Id}:${global.momoApiKey}`)
    let momoBasicToken = buf.toString('base64');
    
    try{
        let result = await fetch(`${momoUrl}collection/token/`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.Ocp_Apim_Subscription_Key,
                'X-Target-Environment': 'sandbox',
                'Authorization': `Basic ${momoBasicToken}`
            }
        });

        if(!result.ok) throw  result;
        let json = result.json();
        global.momoBearerToken = json.access_token;
    } catch(error){
        console.log(error);
    }
}

// createAPIUser();
createAPIKey();