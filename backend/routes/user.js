const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserDetails, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// User routes - ADMIN only
router.get('/', isAuthenticated, isAdmin, getAllUsers);
router.get('/:id', isAuthenticated, isAdmin, getUserDetails);
router.put('/:id', isAuthenticated, isAdmin, updateUser);
router.delete('/:id', isAuthenticated, isAdmin, deleteUser);

module.exports = router; 