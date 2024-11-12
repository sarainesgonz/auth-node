'use strict';

const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'An email should be provided'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password should be provided'],
        select: false,
        trim: true
    }, 
    verified: {
        type: Boolean,
        default: false
    }, 
    verificationToken: {
        type: String,
        select: false
    }, 
    verificationTokenValidation: {
        type: Number,
        select:false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetTokenValidation: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);