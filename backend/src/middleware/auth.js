// src/middleware/auth.js
// Authentication middleware (JWT-based)

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');
const config = require('../config');

/**
 * Middleware to verify JWT token from Authorization header
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No token provided or invalid format');
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1]; // Get token after 'Bearer '
    
    if (!token) {
      console.log('No token found in Authorization header');
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || config.jwt.secret);
    
    // Attach user to request
    req.user = decoded;
    console.log('Authenticated user:', { id: decoded.id, email: decoded.email });
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    console.error('Unexpected auth error:', error);
    return res.status(500).json({ message: 'Authentication failed' });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Continue without user
    next();
  }
}

/**
 * Generate JWT token
 */
function generateToken(payload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

/**
 * Verify token without middleware
 */
function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

// Export all authentication functions
module.exports = {
  authenticate,
  optionalAuth,
  generateToken,
  verifyToken
};