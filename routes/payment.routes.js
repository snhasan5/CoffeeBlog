const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/checkout', paymentController.getCheckoutPage);
router.post('/create-checkout-session', paymentController.createPaymentSession);

router.get('/success', paymentController.getSuccessPage);

router.get('/cancel', paymentController.getCancelPage);

module.exports = router;



