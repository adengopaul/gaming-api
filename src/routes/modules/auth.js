const crypto = require("crypto");
var express = require('express');
var authRoutes = express.Router();
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator');
const aws = require('aws-sdk');
const generateUuid = require('../../functions/strings').generateUuid;
const authFunctions = require('../../functions/auth');
const dbo = require('../../db/conn');
aws.config.update({region: 'eu-central-1'});

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

    const message = `K-${otp} is your Kapapula verification code to ${action} into your account.`;

    var params = {
        Message: message, /* required */
        PhoneNumber: '+256751648404',
    };
    
    var publishTextPromise = new aws.SNS({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        apiVersion: '2010-03-31'
    }).publish(params).promise();

    publishTextPromise.then(async(data)=>{
        const OTP = dbo.getDb().collection('otps');

        try{
            var result = await OTP.insertOne({uuid: user.uuid, otp, createdAt: Date.now()});
            if(result){
                res.status(200).json({
                    message: "Token sent to phone!",
                    uuid: user.uuid
                });
            }
        } catch(error){
            return res.status(500).json(error);
        }  
    });
}  

authRoutes.route('/signup').post(async(req, res) => {
    const Users = dbo.getDb().collection('users');
    try {
        const user = await Users.findOne({phonenumber: req.body.phonenumber});
        if(user){
            return res.status(500).json({ message: 'Account already exists.'});
        }
        req.body['uuid'] = generateUuid();
        var saltHash = authFunctions.setPassword(req.body.password);
        Object.assign(req.body, saltHash); 
        const newUser = await Users.insertOne(req.body);
        sendValidationOTP("Signup", req.body, res);
    } catch (error) {
        if(error) res.status(500).json(error);
    }
});

authRoutes.route('/signin').post(async (req, res, next) => {
    const Users = dbo.getDb().collection('users');

    const { phonenumber, password } = req.body;
    if (!phonenumber && !password) {
      return res.status(400).json({message: "Please provide phone number and password!"}); 
    }

    try {
        var user = await Users.findOne({phonenumber: phonenumber}).catch(err => console.log(err));
        if (!user) {
            return res.status(404).json({message: "User account does not exist. Please signup."}); 
        }
        var valid = authFunctions.validPassword(user.salt, user.hash, password);
        if (!valid) {
            return res.status(401).json({message: "Incorrect password. Please try again."}); 
        }
        // sendValidationOTP("Signin", user, res);
        var token = authFunctions.generateJwt({
            uuid: user.uuid,
            phonenumber: user.phonenumber
        });
    
        console.log(token)
        user.salt = undefined;
        user.hash = undefined;
        res.status(200).json({token, user});
    } catch (error) {
        res.status(500).json(error);
    }
    
  });

authRoutes.route('/forgot-password').post(async (req, res, next) => {
    const Users = dbo.getDb().collection('users');

    const { phonenumber } = req.body;
    if (!phonenumber) {
        return res.status(400).json({message: "Please provide a phone number."}); 
    }
    try {
        const user = await Users.findOne({ phonenumber });
        sendValidationOTP("Reset password", user, res);
    } catch (error) {
        res.status(500).json(error);
    } 
});
  
authRoutes.route('/reset-password').post(async (req, res, next) => {
    const Users = dbo.getDb().collection('users');
    const { phonenumber, password } = req.body;
    if (!phonenumber && !password) {
      return res.status(400).json({message: "Please provide email or phone number and password!"}); 
    }

    try {
        const user = await Users.findOne({ phonenumber });
        if (!user || !authFunctions.validPassword(user.salt, user.hash, password)) {
            return res.status(401).json({message: "Incorrect phone number or password"}); 
        }
        sendValidationOTP("Reset password", user, res);
    } catch (error) {
        (error)=> res.status(500).json(error)
    }
});

authRoutes.route('/update-password').post(async (req, res, next) => {
    const Users = dbo.getDb().collection('users');
    const {uuid, newPassword, phonenumber} = req.body;
    try {
        const user = await Users.findOne({uuid});
        var saltHash = authFunctions.setPassword(newPassword);

        try {
            var result = await Users.updateOne({uuid}, saltHash );
            if(result){
                var token = authFunctions.generateJwt({uuid, phonenumber});
                user.hash = undefined;
                user.salt = undefined;
                res.status(200).json({ token, user});
            } else{
                res.status(500).json({
                    message: 'Password not reset. Try again later.'
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
        
    } catch (error) {
        (error)=> res.status(500).json(error)
    }
  });

  authRoutes.route('/validate-otp').post(async (req, res, next) => {
    const Users = dbo.getDb().collection('users');
    const Otps = dbo.getDb().collection('otps');
    const { otp, uuid } = req.body;

    try {
        const isOTPExsist = await Otps.findOne({ otp, uuid });
        if (!isOTPExsist) {
            return res.status(400).json({message: "OTP doesnot exist or it's expired!"});  
        }
        const user = await Users.findOne({uuid});
        await Otps.deleteOne({ _id: isOTPExsist._id });
        var token = authFunctions.generateJwt({uuid: user.uuid, phonenumber: user.phonenumber});

        user.hash = undefined;
        user.salt = undefined;
        res.status(200).json({
            status: "success",
            token, user,
        });
        
    } catch (error) {
        return res.status(500).json(error)
    }
  });

module.exports = authRoutes;