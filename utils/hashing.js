'use strict';
const { createHmac } = require('crypto');
const {hash, compare} = require('bcryptjs');

exports.hashPassword = (value, saltValue) => {
    const result = hash(value, saltValue)
    return result;
}

exports.comparePassword = (value, hashedValue) => {
    const result = compare(value, hashedValue);
    return result
}

exports.hmacProcess = (value, key) => {
    const result = createHmac('sha256', key).update(value).digest('hex');
    return result;
}