const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import the auth controller and middleware
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Debug log to verify controller methods
console.log('Auth controller methods:', Object.keys(authController).filter(key => typeof authController[key] === 'function'));

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    body('firstName', 'First name is required').not().isEmpty(),
    body('lastName', 'Last name is required').not().isEmpty(),
  ],
  authController.register
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  authController.login
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, authController.getMe);

module.exports = router;
