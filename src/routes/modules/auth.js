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

    publishTextPromise.then(async(data)=>{
        // console.log("MessageID is " + data.MessageId);
        const OTP = dbo.getDb().collection('otps');

        try{
            var result = await OTP.create({userId: user._id, otp});
            if(result){
                console.log(result);
                res.status(200).json({
                    status: "success",
                    message: "Token sent to phone!",
                    userId: user._id
                });
            }
        } catch(error){
            res.status(500).json(error);
        }  
    });
}  

authRoutes.route('/signup').post(async(req, res) => {
    const Users = dbo.getDb().collection('users');
    try {
        const user = await Users.findOne({phone: req.body.phone});
        if(user){
            return res.status(500).json({ message: 'Account already exists.'});
        }
        req.body['uuid'] = generateUuid();
        const newUser = await Users.insertOne(req.body);
        sendValidationOTP("Signup", req.body, res);
    } catch (error) {
        if(error) res.status(500).json(error);
    }
});

authRoutes.route('/signin').post(async (req, res, next) => {
    const Users = dbo.getDb().collection('users');

    const { phone, password } = req.body;
    if (!phone && !password) {
      return res.status(400).json({message: "Please provide phone number and password!"}); 
    }

    try {
        var user = await Users.findOne({phone: phone});
        if (!user) {
            return res.status(404).json({message: "User account does not exist. Please signup."}); 
        }
        var valid = authFunctions.validPassword(password);
        if (!valid) {
            return res.status(401).json({message: "Incorrect password. Please try again."}); 
        }
        // sendValidationOTP("Signin", user, res);
        var token = authFunctions.generateJwt({
            uuid: user.uuid,
            phone: user.phone
        });
    
        res.status(200).json({ status: "success", token, user});
    } catch (error) {
        (error)=> res.status(500).json(error);
    }
    
  });

authRoutes.route('/forgot-password').post(async (req, res, next) => {
    const Users = dbo.getDb().collection('users');

    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({message: "Please provide a phone number."}); 
    }
    try {
        const user = await Users.findOne({ phone });
        sendValidationOTP("Reset password", user, res);
    } catch (error) {
        res.status(500).json(error);
    } 
});
  
authRoutes.route('/reset-password').post(async (req, res, next) => {
    const Users = dbo.getDb().collection('users');
    const { phone, password } = req.body;
    if (!phonenumber && !password) {
      return res.status(400).json({message: "Please provide email or phone number and password!"}); 
    }

    try {
        const user = await Users.findOne({ phone });
        if (!user || !authFunctions.validPassword(password)) {
            return res.status(401).json({message: "Incorrect phone number or password"}); 
        }
        sendValidationOTP("Reset password", user, res);
    } catch (error) {
        (error)=> res.status(500).json(error)
    }
});

authRoutes.route('/update-password').post(async (req, res, next) => {
    const Users = dbo.getDb().collection('users');

    try {
        const user = await Users.findOne({_id: req.body.userId});
        
        var saltHash = authFunctions.setPassword(req.body.newPassword);

        try {
            
        } catch (error) {
            res.status(500).json(error);
        }
        var result = await Users.updateOne({_id: req.body.userId}, saltHash );
        if(result){
            var token = authFunctions.generateJwt({uuid: user.uuid, phone: user.phone});
            user.hash = undefined;
            user.salt = undefined;
            res.status(200).json({
              token, user,
            });
          } else{
            res.status(500).json({
              message: 'Password not reset. Try again later.'
            });
          }
    } catch (error) {
        (error)=> res.status(500).json(error)
    }
  });

  authRoutes.route('/validate-otp').post(async (req, res, next) => {
    const Users = dbo.getDb().collection('users');
    const Otps = dbo.getDb().collection('otps');
    const { otp, userId } = req.body;

    try {
        const isOTPExsist = await OTPModal.findOne({ otp, userId });
        if (!isOTPExsist) {
            return res.status(400).json({message: "OTP doesnot exist or it's expired!"});  
        }
        const user = await User.findById(isOTPExsist.userId);
        await Otps.deleteOne({ _id: isOTPExsist._id });
        var token = authFunctions.generateJwt({uuid: user.uuid, phone: user.phone});

        user.hash = undefined;
        user.salt = undefined;
        res.status(200).json({
            status: "success",
            token, user,
        });
        
    } catch (error) {
        res.status(500).json(error)
    }
  });

module.exports = authRoutes;