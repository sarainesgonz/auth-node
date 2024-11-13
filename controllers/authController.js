'use strict';

const { signupSchema, signinSchema } = require("../middlewares/validator");
const { hashPassword, comparePassword, hmacProcess} = require("../utils/hashing");
const  transport  = require("../middlewares/sendMail");
const jwt = require('jsonwebtoken');
const User = require('../models/Users');


exports.signup = async (req, res) => {
   const { email, password } = req.body;
   try {
        const {error, value} = signupSchema.validate({email, password});

        if (error) {
            return res.status(401).json({success: false, message: error.message});
        }

        const existingUser =await User.findOne({email});

        if(existingUser) {
            return res.status(401).json({success: false, message: 'You already have an account with that email.'});
        }

        const hashedPassword = await hashPassword(password, 10);

        const newUser = new User({email, password: hashedPassword});
        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({success: true, message: "User created successfully ", result});

   } catch (error) {
       console.log(error);
       res.status(500).json({ message: 'Internal server error' });
    
   }

};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const {error, value } = signinSchema.validate({email, password});

        if (error) {
            return res.status(401).json({success: false, message: error.message});
        }
        
        const existingUser = await User.findOne({email}).select('+password');
        if (!existingUser) {
            return res.status(401).json({success: false, message: 'User does not exist'});  
        }

        const result = await comparePassword(password, existingUser.password);
        if (!result) {
            return res.status(401).json({success: false, message: 'Invalid credentials'});
        }

        // otherwise:
        const token = jwt.sign({
            id: existingUser._id,
            email: existingUser.email, 
            verified: existingUser.verified
        }, process.env.TOKEN_SECRET, {expiresIn: '2h'});

        res.cookie('Authorization', 'Bearer ' + token, {httpOnly: true, secure: true})
        .json({success: true, message: 'Logged in successfully', token});

    } catch (error) {
        console.log(error);
    }
}

exports.signout = async (req, res) => {
    res.clearCookie('Authorization').json({success: true, message: 'Logged out successfully'});
}

exports.verifyAccount = async (req, res) => {
    const {email} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if (!existingUser) {
            return res.status(404).json({success: false, message: 'User does not exist'});
        }
        if (existingUser.verified) {
            return res.status(400).json({success: false, message: 'Your account is already verified'});
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); //check

   
        const infoSent = await transport.sendMail({
            from: process.env.NODE_EMAIL_ADDRESS,
            to: existingUser.email,
            subject: 'Account Verification',
            text: `Your verification code is ${verificationCode}`
        });
        // CHECK IF EMAIL WAS SENT SUCCESSFULLY
        if(infoSent.accepted[0] === existingUser.email){
            const hashedCode = hmacProcess(verificationCode, process.env.VERIFICATION_SECRET_HMAC);
            existingUser.verificationCode = hashedCode;
            existingUser.verificationCodeExpiration = Date.now() + 600000;
            await existingUser.save();
            
            return res.status(200).json({success: true, message: 'Verification code sent successfully'});
        }
        res.status(400).json({success: false, message: 'Process failed'});
    } catch (error) {
        console.log(error)
    }
}