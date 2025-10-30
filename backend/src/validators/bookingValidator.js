// src/validators/bookingValidator.js
// Request validation middleware for bookings

const { body, query, param, validationResult } = require('express-validator');
const { BadRequestError } = require('../utils/errors');

/**
 * Validation rules for creating a booking
 */
const createBookingRules = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name must be 50 characters or less')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name must contain only letters'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name must be 50 characters or less')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name must contain only letters'),

  body('vehicleId')
    .notEmpty()
    .withMessage('Vehicle ID is required')
    .isInt({ min: 1 })
    .withMessage('Vehicle ID must be a positive integer'),

  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),

  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date (YYYY-MM-DD)')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate < startDate) {
        throw new Error('End date must be on or after start date');
      }
      return true;
    }),
];

/**
 * Validation rules for checking availability
 */
const checkAvailabilityRules = [
  query('vehicleId')
    .notEmpty()
    .withMessage('Vehicle ID is required')
    .isInt({ min: 1 })
    .withMessage('Vehicle ID must be a positive integer'),

  query('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date (YYYY-MM-DD)'),

  query('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date (YYYY-MM-DD)'),
];

/**
 * Validation rules for getting vehicles
 */
const getVehiclesRules = [
  query('typeId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Type ID must be a positive integer'),
];

/**
 * Validation rules for getting types
 */
const getTypesRules = [
  query('wheels')
    .optional()
    .isInt()
    .withMessage('Wheels must be an integer')
    .isIn([2, 4])
    .withMessage('Wheels must be either 2 or 4'),
];

/**
 * Validation rules for canceling a booking
 */
const cancelBookingRules = [
  param('id')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isInt({ min: 1 })
    .withMessage('Booking ID must be a positive integer'),
];

/**
 * Middleware to check validation results
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));

    throw new BadRequestError('Validation failed', formattedErrors);
  }
  
  next();
}

module.exports = {
  createBookingRules,
  checkAvailabilityRules,
  getVehiclesRules,
  getTypesRules,
  cancelBookingRules,
  validate,
};