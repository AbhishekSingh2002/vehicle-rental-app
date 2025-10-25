import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Layouts
import ModernLayout from './components/layout/ModernLayout';

// Pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('auth_token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => (
  <Router>
    <AuthProvider>
      <BookingProvider>
        <Routes>
          <Route 
            path="/" 
            element={
              <ModernLayout>
                <HomePage />
              </ModernLayout>
            } 
          />
          
          <Route 
            path="/booking" 
            element={
              <ModernLayout>
                <BookingPage />
              </ModernLayout>
            } 
          />

          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <ModernLayout>
                  <MyBookingsPage />
                </ModernLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/login" 
            element={
              <ModernLayout>
                <LoginPage />
              </ModernLayout>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <ModernLayout>
                <RegisterPage />
              </ModernLayout>
            } 
          />
          
          <Route 
            path="*" 
            element={
              <ModernLayout>
                <div className="min-h-[60vh] flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Page not found</p>
                    <Link 
                      to="/" 
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Go back home
                    </Link>
                  </div>
                </div>
              </ModernLayout>
            } 
          />
        </Routes>
      </BookingProvider>
    </AuthProvider>
  </Router>
);

export default App;