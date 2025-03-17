# E-Commerce Frontend

This is the frontend for the MERN stack e-commerce application.

## Features

- User authentication with JWT
- Product browsing by categories
- Direct checkout without cart
- Payment processing with Stripe
- Order history and profile management
- Admin panel for product, order, and user management

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_test_publishable_key
   ```
4. Start the development server:
   ```
   npm start
   ```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects the app from Create React App

## Technologies Used

- React.js
- React Router
- Tailwind CSS
- Stripe for payment processing
- Axios for API requests
- React Toastify for notifications 