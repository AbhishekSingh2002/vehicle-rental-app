// frontend/src/context/AuthContext.js
// Authentication context for managing user state

import React, { createContext, useContext, useState, useEffect } from 'react';

const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user:', e);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
        }
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || '/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, data.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify({ ...data.user, token: data.token }));
      
      setToken(data.token);
      setUser({ ...data.user, token: data.token });
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || '/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      
      // Auto-login after registration
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, data.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify({ ...data.user, token: data.token }));
      
      setToken(data.token);
      setUser({ ...data.user, token: data.token });
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Check if user is authenticated - returns boolean
  const isAuthenticated = () => {
    const hasToken = !!token;
    const hasUser = !!user;
    return hasToken && hasUser;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;