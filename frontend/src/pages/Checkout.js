import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import '../styles/Checkout.css';
import stripePromise from '../utils/stripe';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Checkout form component
const CheckoutForm = ({ totalAmount, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        console.log('Creating payment intent for amount:', totalAmount);
        const response = await axios.post(`${API_URL}/payment/process`, {
          amount: totalAmount,
          email: user.email
        }, {
        withCredentials: true, // ✅ Include credentials
      });
        setClientSecret(response.data.client_secret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        toast.error('Failed to initialize payment. Please try again.');
      }
    };

    if (totalAmount > 0 && user) {
      createPaymentIntent();
    }
  }, [totalAmount, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setLoading(true);

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.name,
            email: user.email
          }
        }
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Create order
        const orderData = {
          orderItems: cartItems.map(item => ({
            product: item._id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity
          })),
          shippingAddress: {
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value,
            country: document.getElementById('country').value,
          },
          paymentInfo: {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status
          },
          totalPrice: totalAmount
        };

        // Log the order data for debugging
        console.log('Submitting order:', orderData);
        
        try {
          await axios.post(`${API_URL}/orders`, orderData);
          toast.success('Payment successful!');
          onSuccess();
        } catch (orderError) {
          console.error('Order creation error:', orderError);
          // Even if order creation fails, we've already charged the card
          // So we'll still consider this a success but log the error
          toast.warning('Payment processed but order details may not have been saved. Please contact support.');
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-payment-form">
      <div className="mb-4">
        <label className="form-label">Card Details</label>
        <div className="stripe-element">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      <button 
        type="submit" 
        className="checkout-submit-btn"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
};

// Main checkout page component
const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax + shipping;

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePaymentSuccess = () => {
    clearCart();
    navigate('/order/success');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      
      <div className="checkout-grid">
        <div className="checkout-product-details">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            {cartItems.map(item => (
              <div key={item._id} className="flex items-center py-2 border-b last:border-b-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold mb-2">Shipping Information</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  id="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  id="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  id="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="checkout-payment">
          <h3 className="checkout-payment-title">Payment Details</h3>
          
          <div className="mb-6">
            <div className="checkout-summary-item">
              <span className="checkout-summary-label">Subtotal:</span>
              <span className="checkout-summary-value">${subtotal.toFixed(2)}</span>
            </div>
            <div className="checkout-summary-item">
              <span className="checkout-summary-label">Shipping:</span>
              <span className="checkout-summary-value">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="checkout-summary-item">
              <span className="checkout-summary-label">Tax (10%):</span>
              <span className="checkout-summary-value">${tax.toFixed(2)}</span>
            </div>
            <div className="checkout-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <Elements stripe={stripePromise}>
            <CheckoutForm totalAmount={total} onSuccess={handlePaymentSuccess} />
          </Elements>
          
          <div className="mt-4 text-center">
            <Link to="/cart" className="text-primary hover:underline">
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 
