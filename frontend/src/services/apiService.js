// frontend/src/services/apiService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Build headers with authentication if available
 */
const buildHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Handle API response and errors
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(data.error || data.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

/**
 * Fetch vehicle types, optionally filtered by wheels
 * @param {number|null} wheels - 2 or 4, or null for all types
 * @returns {Promise<Array>} Vehicle types
 */
export async function getTypes(wheels = null) {
  const url = wheels 
    ? `${API_BASE_URL}/types?wheels=${wheels}`
    : `${API_BASE_URL}/types`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching types:', error);
    throw error;
  }
}

/**
 * Fetch vehicles, optionally filtered by type
 * @param {number|null} typeId - Filter by type ID
 * @returns {Promise<Array>} Vehicles
 */
export async function getVehicles(typeId = null) {
  const url = typeId
    ? `${API_BASE_URL}/vehicles?typeId=${typeId}`
    : `${API_BASE_URL}/vehicles`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
}

// ... (other API functions)

export default {
  getTypes,
  getVehicles,
  // ... other exports
};
