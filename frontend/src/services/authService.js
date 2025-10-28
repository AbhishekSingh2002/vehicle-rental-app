import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Helper function to handle errors
const handleError = (error) => {
  console.error('Auth Service Error:', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    if (status === 401) {
      // Clear any invalid token on 401
      localStorage.removeItem('user');
    }
    throw data?.message || 'Authentication failed';
  } else if (error.request) {
    // The request was made but no response was received
    throw 'No response from server. Please check your connection.';
  } else {
    // Something happened in setting up the request
    throw error.message || 'An error occurred during authentication';
  }
};

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Login user
const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get current user
const getCurrentUser = () => {
  try {
    const userRaw = localStorage.getItem('user');
    const authToken = localStorage.getItem('auth_token');
    let user = null;
    if (userRaw) {
      user = JSON.parse(userRaw);
    }
    // If user doesn't have token but auth_token exists, merge it
    if (user && !user.token && authToken) {
      return { ...user, token: authToken };
    }
    // If no user but token exists, return minimal object with token
    if (!user && authToken) {
      return { token: authToken };
    }
    return user;
  } catch (_) {
    return null;
  }
};

// Get auth header
const getAuthHeader = () => {
  const current = getCurrentUser();
  if (current && current.token) {
    return { Authorization: `Bearer ${current.token}` };
  } else {
    return {};
  }
};

export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getAuthHeader,
};

export default authService;
