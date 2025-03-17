const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getSingleOrder, 
  myOrders, 
  getAllOrders, 
  updateOrder 
} = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Order routes
router.post('/', isAuthenticated, createOrder);
router.get('/me', isAuthenticated, myOrders);
router.get('/:id', isAuthenticated, getSingleOrder);
router.get('/', isAuthenticated, isAdmin, getAllOrders);
router.put('/:id', isAuthenticated, isAdmin, updateOrder);

module.exports = router; 