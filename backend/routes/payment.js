const express = require('express');
const router = express.Router();
const { processPayment, sendStripeApiKey } = require('../controllers/paymentController');
const { isAuthenticated } = require('../middleware/auth');

// Payment routes
router.post('/process', isAuthenticated, processPayment);
router.get('/stripeapi', isAuthenticated, sendStripeApiKey);

module.exports = router; 