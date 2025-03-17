// Environment variables
const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ''
};

// Debug environment variables
console.log('Environment variables loaded:');
console.log('API_URL:', config.API_URL);
console.log('STRIPE_PUBLISHABLE_KEY:', config.STRIPE_PUBLISHABLE_KEY ? 'Key exists (starts with ' + config.STRIPE_PUBLISHABLE_KEY.substring(0, 7) + '...)' : 'Missing key');

// Validate required environment variables
if (!config.STRIPE_PUBLISHABLE_KEY) {
  console.error('Missing REACT_APP_STRIPE_PUBLISHABLE_KEY environment variable');
}

export default config; 