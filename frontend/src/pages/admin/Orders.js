import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/Admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders`,  {
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

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  // Helper function to get order price
  const getOrderPrice = (order) => {
    if (order.totalPrice) return order.totalPrice;
    if (order.price) return order.price;
    
    // If neither exists, calculate from orderItems
    if (order.orderItems && order.orderItems.length > 0) {
      return order.orderItems.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1));
      }, 0);
    }
    
    return 0;
  };

  // Helper function to get product display info
  const getProductDisplay = (order) => {
    // For single product orders
    if (order.product && order.product.name) {
      return {
        image: order.product.image || getPlaceholderImage(),
        name: order.product.name,
        multiple: false
      };
    }
    
    // For cart orders with multiple items
    if (order.orderItems && order.orderItems.length > 0) {
      const firstItem = order.orderItems[0];
      return {
        image: firstItem.image || getPlaceholderImage(),
        name: `${firstItem.name} ${order.orderItems.length > 1 ? `+ ${order.orderItems.length - 1} more items` : ''}`,
        multiple: order.orderItems.length > 1
      };
    }
    
    // Fallback
    return {
      image: getPlaceholderImage(),
      name: 'Unknown Product',
      multiple: false
    };
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}`, {
        orderStatus: newStatus
      });
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
      console.error('Error updating order status:', error);
    }
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
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Order Management</h1>
      </div>
      
      <div className="admin-tabs">
        <Link to="/admin" className="admin-tab">Dashboard</Link>
        <Link to="/admin/products" className="admin-tab">Products</Link>
        <Link to="/admin/orders" className="admin-tab active">Orders</Link>
        <Link to="/admin/users" className="admin-tab">Users</Link>
      </div>
      
      <div className="admin-content">
        <h2 className="admin-section-title">All Orders</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead className="admin-table-header">
                <tr>
                  <th className="admin-table-header-cell">Order ID</th>
                  <th className="admin-table-header-cell">Product</th>
                  <th className="admin-table-header-cell">Customer</th>
                  <th className="admin-table-header-cell">Price</th>
                  <th className="admin-table-header-cell">Date</th>
                  <th className="admin-table-header-cell">Delivery Date</th>
                  <th className="admin-table-header-cell">Status</th>
                  <th className="admin-table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="admin-table-body">
                {orders.map((order) => {
                  const productDisplay = getProductDisplay(order);
                  const orderPrice = getOrderPrice(order);
                  
                  return (
                    <tr key={order._id} className="admin-table-row">
                      <td className="admin-table-cell font-medium">{order._id.substring(0, 8)}...</td>
                      <td className="admin-table-cell">
                        <div className="flex items-center">
                          <img 
                            src={productDisplay.image} 
                            alt={productDisplay.name} 
                            className="w-10 h-10 object-cover rounded mr-2"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getPlaceholderImage();
                            }}
                          />
                          <span className={productDisplay.multiple ? 'text-xs' : ''}>
                            {productDisplay.name}
                          </span>
                        </div>
                      </td>
                      <td className="admin-table-cell">{order.user?.name || 'Unknown User'}</td>
                      <td className="admin-table-cell">${orderPrice.toFixed(2)}</td>
                      <td className="admin-table-cell">{formatDate(order.createdAt)}</td>
                      <td className="admin-table-cell">{formatDate(order.deliveryDate)}</td>
                      <td className="admin-table-cell">
                        <span className={`order-status ${getStatusClass(order.orderStatus)}`}>
                          {order.orderStatus || 'Processing'}
                        </span>
                      </td>
                      <td className="admin-table-cell">
                        <select 
                          className="form-input py-1 px-2 text-sm"
                          value={order.orderStatus || 'Processing'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 
