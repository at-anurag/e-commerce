# E-Commerce Backend

This is the backend for the MERN stack e-commerce application.

## Features

- User authentication with JWT
- Product management
- Order management
- Payment processing with Stripe
- Admin panel

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   COOKIE_EXPIRE=30
   STRIPE_PUBLISHABLE_KEY=your_stripe_test_publishable_key
   STRIPE_SECRET_KEY=your_stripe_test_secret_key
   CLIENT_URL=http://localhost:3000
   ```
4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get user profile

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product (Admin only)
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/upload` - Upload product image (Admin only)

### Orders

- `POST /api/orders` - Create a new order
- `GET /api/orders/me` - Get logged in user orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id` - Update order status (Admin only)

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user details (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Payment

- `POST /api/payment/process` - Process payment
- `GET /api/payment/stripeapi` - Get Stripe API key 