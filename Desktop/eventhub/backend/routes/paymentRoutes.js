const express = require('express');
const {
  createPaymentIntent,
  verifyPayment,
  stripeWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;

