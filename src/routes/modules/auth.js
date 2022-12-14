const crypto = require("crypto");
var express = require('express');
var authRoutes = express.Router();
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator');
const aws = require('aws-sdk');
const generateUuid = require('../../functions/strings').generateUuid;

const dbo = require('../../db/conn');

aws.config.update({region: 'eu-central-1'});

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };
  
const createSendToken = (user, statusCode, res) => {
const token = signToken(user._id);
const cookieOptions = {
    expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
};
if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

res.cookie("jwt", token, cookieOptions);

user.password = undefined;

res.status(statusCode).json({
    status: "success",
    token,
    data: {
    user,
    },
});
};

const sendValidationOTP = (action, user, res) => {
    // let otp = Math.random();
    // otp = otp * 100000;
    // otp = parseInt(otp);

    let otp = otpGenerator.generate(6, { 
        digits: true,
        alphabets: false,
        upperCase: false, 
        specialChars: false 
    });

    const message = `${otp} is your Kapapula verification code to ${action} into your account.`;

    var params = {
        Message: message, /* required */
        PhoneNumber: '+256751648404',
    };
    
    var publishTextPromise = new aws.SNS({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        apiVersion: '2010-03-31'
    }).publish(params).promise();

    publishTextPromise.then((data)=>{
        console.log("MessageID is " + data.MessageId);
        const OTP = dbo.getDb().collection('otps');
        OTP.create({
            userId: user._id,
            otp
        }, (err, result) => {
            if(err){
                console.log(err);
                res.status(500).json(err);
            }
            if(result){
                console.log(result);
                res.status(200).json({
                    status: "success",
                    message: "Token sent to phone!",
                    userId: user._id
                });
            }
        });
        }, (err) => {
        return res.status(500).json(err);
    });
}  

authRoutes.route('/signup').post(async(req, res) => {
    const Users = dbo.getDb().collection('users');
    try {
        // const user = await Users.findOne({phone: req.body.phone});
        // if(user){
        //     return res.status(500).json({ message: 'Account already exists.'});
        // }
        req.body['uuid'] = generateUuid();
        // const newUser = await Users.insertOne(req.body);
        // console.log(newUser)
        sendValidationOTP("Signup", req.body, res);
    } catch (error) {
        console.log(error)
        if(error) res.status(500).json(error);
    }
})

module.exports = authRoutes;