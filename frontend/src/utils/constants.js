// frontend/src/utils/constants.js
// Application constants

export const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const WHEEL_OPTIONS = [
  { value: 2, label: 'Bike (2 Wheeler)', icon: '🏍️' },
  { value: 4, label: 'Car (4 Wheeler)', icon: '🚗' },
];

export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
};

export const ROUTES = {
  HOME: '/',
  BOOKING: '/booking',
  MY_BOOKINGS: '/my-bookings',
  LOGIN: '/login',
  REGISTER: '/register',
};

export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s]+$/,
  },
  DATE: {
    FORMAT: 'YYYY-MM-DD',
  },
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  BOOKING_OVERLAP: 'Vehicle is not available for selected dates.',
  PAST_DATE: 'Cannot book dates in the past.',
};

export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking created successfully!',
  BOOKING_CANCELLED: 'Booking cancelled successfully!',
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
};

const constants = {
  API_BASE_URL,
  WHEEL_OPTIONS,
  BOOKING_STATUS,
  ROUTES,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOCAL_STORAGE_KEYS,
};

export default constants;