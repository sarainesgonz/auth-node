'use strict';

const { singupSchema } = require("../middlewares/validator");
const User = require('../models/Users');

exports.singup = async (req, res) => {
   const { email, password } = req.body;
   try {
        const {error, value} = singupSchema.validate({email, password});

        if (error) {
            return res.status(401).json({success: false, message: error.message});
        }

        const existingUser =await User.findOne({email});

        if(existingUser) {
            return res.status(401).json({success: false, message: 'You already have an account with that email.'});
        }

   } catch (error) {
       console.log(error);
       res.status(500).json({ message: 'Internal server error' });
    
   }

};

