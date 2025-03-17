const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Login first to access this resource'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to access this resource'
    });
  }
  
  next();
}; 