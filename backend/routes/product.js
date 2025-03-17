const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  createProduct, 
  getSingleProduct, 
  updateProduct, 
  deleteProduct, 
  getProductsByCategory
} = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Product routes
router.get('/', isAuthenticated, getProducts);
router.post('/', isAuthenticated, isAdmin, createProduct);
router.get('/category/:category', isAuthenticated, getProductsByCategory);
router.get('/:id', isAuthenticated, getSingleProduct);
router.put('/:id', isAuthenticated, isAdmin, updateProduct);
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);

module.exports = router; 