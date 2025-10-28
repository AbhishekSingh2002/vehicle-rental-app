// frontend/src/services/apiConfig.js
// API configuration and environment settings

export const API_CONFIG = {
  // Base URLs for different environments
  baseURL: process.env.REACT_APP_API_URL || '/api',
  
  // Timeout settings
  timeout: 10000, // 30 seconds
  
  // Retry settings
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  
  // API endpoints
  endpoints: {
    // Auth
    login: '/auth/login',
    register: '/auth/register',
    profile: '/auth/profile',
    
    // Vehicles
    wheels: '/wheels',
    types: '/types',
    vehicles: '/vehicles',
    
    // Bookings
    bookings: '/bookings',
    checkAvailability: '/bookings/check-availability',
    myBookings: '/bookings/my-bookings',
    
    // Health
    health: '/health',
  },
};

/**
 * Get full API URL for an endpoint
 */
export function getApiUrl(endpoint) {
  return `${API_CONFIG.baseURL}${endpoint}`;
}

/**
 * Check if API is available
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_CONFIG.baseURL.replace('/api', '')}/health`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}

export default {
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
};