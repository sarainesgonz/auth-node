'use strict';

const Joi = require('joi');

exports.signupSchema = Joi.object({
    email: Joi.string()
    .required()
    .email( {tlds:[ 'com', 'net', 'org', 'io', 'int', 'gov', 'edu' ]}),
    password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
    .message('Password must have at least 8 characters, one uppercase letter, one lowercase letter, one special character and one number')
});

exports.signinSchema = Joi.object({
    email: Joi.string()
    .required()
    .email( {tlds:[ 'com', 'net', 'org', 'io', 'int', 'gov', 'edu' ]}),
    password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
    .message('Password must have at least 8 characters, one uppercase letter, one lowercase letter, one special character and one number')
});