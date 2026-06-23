const express  = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignupPage);
router.post('/signup', authController.postSignup);
module.exports = router