// src/utils/validation.js
// Validation utility functions

/**
 * Check if value is a positive integer
 * @param {any} value
 * @returns {boolean}
 */
function isPositiveInteger(value) {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  isPositiveInteger,
  isValidEmail,
};