const dbo = require('../../db/conn');
const fetch = require('node-fetch');
const generateUuid = require('../../functions/strings');

createAPIUser = () => {
    const url = `${process.env.MOMO_URL}/apiuser`;
    fetch(url, {
        method: 'post',
        headers: { 
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.Ocp_Apim_Subscription_Key
        },
        body: {
            "providerCallbackHost": "https://webhook.site/277fe86c-66d9-4da6-b8b1-2f681e4ade23"
        }
    })
    .then(res => res.json())
    .then((json) => {
        console.log(json);
    });
}