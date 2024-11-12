'use strict';

const { signupSchema, signinSchema } = require("../middlewares/validator");
const { hashPassword, comparePassword} = require("../utils/hashing");
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
            return res.status(401).json({success: false, message: 'Non-existing user'});
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