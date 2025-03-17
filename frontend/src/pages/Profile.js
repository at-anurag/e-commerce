import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/orders/me`,  {
        withCredentials: true, // ✅ Include credentials
      });
        console.log('Orders data:', response.data);
        setOrders(response.data.orders || []);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch orders');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to get status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'order-status-processing';
      case 'Shipped':
        return 'order-status-shipped';
      case 'Delivered':
        return 'order-status-delivered';
      default:
        return 'order-status-processing';
    }
  };

  // Helper function to get a placeholder image
  const getPlaceholderImage = () => {
    return 'https://via.placeholder.com/150?text=No+Image';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
      
      <div className="profile-header">
        <h2 className="profile-title">Personal Information</h2>
        <div className="profile-info">
          <div className="profile-info-item">
            <p className="profile-info-label">Name</p>
            <p className="profile-info-value">{user.name}</p>
          </div>
          <div className="profile-info-item">
            <p className="profile-info-label">Email</p>
            <p className="profile-info-value">{user.email}</p>
          </div>
          <div className="profile-info-item">
            <p className="profile-info-label">Account Type</p>
            <p className="profile-info-value capitalize">{user.role}</p>
          </div>
          <div className="profile-info-item">
            <p className="profile-info-label">Member Since</p>
            <p className="profile-info-value">{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <div className="profile-orders">
        <h2 className="profile-orders-title">Order History</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <p className="order-id">Order ID: {order._id}</p>
                    <p className="order-date">Placed on: {formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`order-status ${getStatusClass(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
                
                {/* Handle single product orders */}
                {order.product && (
                  <div className="order-product">
                    <img 
                      src={order.product.image || getPlaceholderImage()} 
                      alt={order.product.name || 'Product'} 
                      className="order-product-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getPlaceholderImage();
                      }}
                    />
                    <div className="order-product-details">
                      <h3 className="order-product-name">{order.product.name || 'Product'}</h3>
                      <p className="order-product-price">${order.price ? order.price.toFixed(2) : '0.00'}</p>
                    </div>
                  </div>
                )}
                
                {/* Handle cart orders with multiple items */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="order-items">
                    <h3 className="text-lg font-semibold mb-2">Items</h3>
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="order-product">
                        <img 
                          src={item.image || getPlaceholderImage()} 
                          alt={item.name || 'Product'} 
                          className="order-product-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getPlaceholderImage();
                          }}
                        />
                        <div className="order-product-details">
                          <h3 className="order-product-name">{item.name || 'Product'}</h3>
                          <p className="order-product-quantity">Quantity: {item.quantity || 1}</p>
                          <p className="order-product-price">${item.price ? item.price.toFixed(2) : '0.00'}</p>
                        </div>
                      </div>
                    ))}
                    <div className="order-total mt-2 pt-2 border-t border-gray-200">
                      <p className="text-right font-bold">
                        Total: ${order.totalPrice ? order.totalPrice.toFixed(2) : order.price ? order.price.toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="order-delivery">
                  <p>Estimated Delivery: {order.deliveryDate ? formatDate(order.deliveryDate) : 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 
