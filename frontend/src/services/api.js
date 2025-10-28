// frontend/src/services/api.js
// API service for making HTTP requests

import axios from 'axios';
import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance with default config
const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000 // 10 seconds timeout
});

// Add request interceptor to include auth token
http.interceptors.request.use(
  (config) => {
    const token = authService.getCurrentUser()?.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      // Remove legacy header if present
      delete config.headers['x-auth-token'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear any invalid token
      authService.logout();
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // You can add more error handling here if needed
    return Promise.reject(error);
  }
);

// Mock data (temporary, will be removed when backend is fully integrated)
const mockTypes = {
  2: [
    { id: 1, name: 'Cruiser', wheels: 2 },
    { id: 2, name: 'Sport Bike', wheels: 2 },
    { id: 3, name: 'Scooter', wheels: 2 }
  ],
  4: [
    { id: 4, name: 'Hatchback', wheels: 4 },
    { id: 5, name: 'Sedan', wheels: 4 },
    { id: 6, name: 'SUV', wheels: 4 }
  ]
};

const mockVehicles = {
  1: [
    { id: 1, name: 'Honda Rebel 500', typeId: 1, price: 50 },
    { id: 2, name: 'Harley Street 750', typeId: 1, price: 70 }
  ],
  2: [
    { id: 3, name: 'Kawasaki Ninja 400', typeId: 2, price: 60 },
    { id: 4, name: 'Yamaha R3', typeId: 2, price: 65 }
  ],
  3: [
    { id: 5, name: 'Honda PCX150', typeId: 3, price: 40 },
    { id: 6, name: 'Vespa Primavera', typeId: 3, price: 45 }
  ],
  4: [
    { id: 7, name: 'Toyota Yaris', typeId: 4, price: 80 },
    { id: 8, name: 'Honda Fit', typeId: 4, price: 75 }
  ],
  5: [
    { id: 9, name: 'Toyota Camry', typeId: 5, price: 100 },
    { id: 10, name: 'Honda Accord', typeId: 5, price: 95 }
  ],
  6: [
    { id: 11, name: 'Toyota RAV4', typeId: 6, price: 120 },
    { id: 12, name: 'Honda CR-V', typeId: 6, price: 125 }
  ]
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get vehicle types by number of wheels (from backend, fallback to mock)
 */
export async function getTypes(wheels) {
  try {
    const response = await http.get('/types', { params: wheels ? { wheels } : {} });
    return Array.isArray(response.data) ? response.data : [];
  } catch (e) {
    await delay(300);
    return mockTypes[wheels] || [];
  }
}

/**
 * Get vehicles by type ID (from backend, fallback to mock)
 */
export async function getVehicles(typeId) {
  try {
    const response = await http.get('/vehicles', { params: { typeId } });
    return Array.isArray(response.data) ? response.data.map(v => ({
      id: v.id,
      name: v.name,
      typeId: v.typeId,
      type: v.type?.name,
      price: v.metadata?.pricePerDay || v.price || 0,
      image: v.metadata?.image || v.image || ''
    })) : [];
  } catch (e) {
    await delay(300);
    return mockVehicles[typeId] || [];
  }
}

/**
 * Get available wheel counts
 */
export async function getWheels() {
  try {
    const response = await http.get('/wheels');
    return Array.isArray(response.data) ? response.data : [2, 4];
  } catch (e) {
    await delay(100);
    return [2, 4];
  }
}

/**
 * Create a new booking
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} Created booking
 */
/**
 * Create a new booking
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} Created booking
 */
export async function createBooking(bookingData) {
  try {
    console.log('Creating booking with data:', bookingData);
    
    // Ensure vehicleId is a number
    const bookingDataCopy = {
      ...bookingData,
      vehicleId: Number(bookingData.vehicleId)
    };

    const response = await http.post('/bookings', bookingDataCopy, {
      // Add timeout to prevent hanging
      timeout: 10000 // 10 seconds
    });
    
    console.log('Booking created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        data: error.config?.data,
        headers: error.config?.headers
      }
    });

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.error || 'Failed to create booking';
      const err = new Error(errorMessage);
      err.status = error.response.status;
      err.details = error.response.data?.details;
      throw err;
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Request timed out. Please check your connection and try again.');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || 'Error creating booking');
    }
  }
}

/**
 * Check if a vehicle is available for given dates
 * @param {number} vehicleId
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @returns {Promise<{available: boolean}>}
 */
/**
 * Check if a vehicle is available for the given date range
 * @param {number|string} vehicleId - The ID of the vehicle to check
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<{available: boolean}>} Object with availability status
 */
export async function checkAvailability(vehicleId, startDate, endDate) {
  try {
    // Ensure vehicleId is a number
    const numericVehicleId = Number(vehicleId);
    if (isNaN(numericVehicleId)) {
      console.error('Invalid vehicleId:', vehicleId);
      return { available: false, error: 'Invalid vehicle ID' };
    }

    console.log('Checking availability for:', { 
      vehicleId: numericVehicleId, 
      startDate, 
      endDate 
    });

    const response = await http.get('/bookings/check-availability', {
      params: { 
        vehicleId: numericVehicleId, 
        startDate, 
        endDate 
      },
      // Add timeout to prevent hanging
      timeout: 5000
    });

    console.log('Availability response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking availability:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        params: error.config?.params
      }
    });
    
    // Return available: false on error to prevent false positives
    return { 
      available: false, 
      error: error.response?.data?.error || 'Error checking availability' 
    };
  }
}

// Not used in the current implementation but kept for completeness
export async function getVehicleBookings() {
  await delay(300);
  return [];
}

// Fetch current user's bookings from backend
export async function getMyBookings() {
  const token = authService.getCurrentUser()?.token;
  if (!token) {
    return [];
  }
  const response = await http.get('/bookings/my');
  return response.data;
}

// Cancel booking via backend
export async function cancelBooking(bookingId) {
  const response = await http.patch(`/bookings/${bookingId}/cancel`);
  return response.data;
}

export async function getVehicleById(vehicleId) {
  const response = await http.get(`/vehicles/${vehicleId}`);
  return response.data;
}

const apiService = {
  // API methods
  getTypes,
  getVehicles,
  getWheels,
  getVehicleById,
  createBooking,
  checkAvailability,
  getVehicleBookings,
  getMyBookings,
  cancelBooking,
  
  // HTTP methods for direct API calls
  get: (url, config) => http.get(url, config),
  post: (url, data, config) => http.post(url, data, config),
  put: (url, data, config) => http.put(url, data, config),
  delete: (url, config) => http.delete(url, config),
};

export default apiService;