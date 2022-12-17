const AfricasTalking = require('africastalking');

const africastalking = AfricasTalking({
    apiKey: process.env.AFRICAS_TALKING_API_KEY, 
    username: process.env.AFRICAS_TALKING_USERNAME
  });

module.exports = async function sendSMS(phonenumber, message, ) {
    try {
        const result=await africastalking.SMS.send({
          to: phonenumber, 
          message: message,
          from: process.env.AFRICAS_TALKING_SENDER_ID
        });
        console.log(result);
      } catch(ex) {
        console.error(ex);
      } 
};