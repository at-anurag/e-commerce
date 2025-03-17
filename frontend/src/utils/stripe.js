import { loadStripe } from '@stripe/stripe-js';

// Get the publishable key from environment variables
const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

// Debug information
console.log('Stripe initialization:');
console.log('Publishable key exists:', !!publishableKey);
if (publishableKey) {
  console.log('Key starts with:', publishableKey.substring(0, 7));
} else {
  console.error('Missing Stripe publishable key. Please check your .env file.');
}

// Initialize Stripe
let stripePromise;
try {
  stripePromise = loadStripe(publishableKey);
} catch (error) {
  console.error('Error initializing Stripe:', error);
  stripePromise = null;
}

export default stripePromise; 