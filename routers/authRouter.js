'use strict';

const express = require('express'  );
const router = express.Router();
const authController = require('../controllers/authController');


// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/signin
router.post('/signin', authController.signin);

router.post('/signout', authController.signout);


router.patch('/account-verification', authController.verifyAccount);

module.exports = router;