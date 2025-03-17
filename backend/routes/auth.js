const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserProfile } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', isAuthenticated, getUserProfile);

module.exports = router; 