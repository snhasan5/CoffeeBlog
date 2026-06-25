const express  = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const authValidate = require('../validators/auth.validate');
const isAuth = require('../utils/is-auth');

router.get('/login', authController.getLoginPage);
router.post('/login',authValidate.loginValidator, authController.postLogin);
router.get('/signup', authController.getSignupPage);
router.post('/signup', authValidate.signupValidator,  authController.postSignup);
router.post('/logout',isAuth, authController.postLogout);
router.get('/reset', authController.getResetPage);
router.post('/reset',authController.postReset);
router.get('/reset/:token', authController.getNewPasswordPage);
router.post('/new-password',authController.postNewPassword);
module.exports = router