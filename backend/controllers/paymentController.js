const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Process payment => /api/payment/process
exports.processPayment = async (req, res) => {
  try {
    const { amount, email } = req.body;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: { integration_check: 'accept_a_payment' },
      receipt_email: email
    });

    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Send Stripe API Key => /api/payment/stripeapi
exports.sendStripeApiKey = async (req, res) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
}; 