const nodemailer = require('nodemailer');   

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODE_EMAIL_ADDRESS,
        pass: process.env.NODE_EMAIL_PASSWORD
    }, 
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transport;