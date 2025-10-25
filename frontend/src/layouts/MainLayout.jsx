// frontend/src/layouts/MainLayout.jsx
// Main layout with header and footer

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <Car size={28} />
              <span>VehicleRental</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
                Home
              </Link>
              <Link to="/booking" className="text-gray-700 hover:text-blue-600 transition">
                Book Now
              </Link>
              <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 transition">
                My Bookings
              </Link>

              {isAuthenticated() ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <User size={20} className="text-gray-600" />
                    <span className="text-gray-700">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t">
              <div className="flex flex-col gap-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/booking"
                  className="text-gray-700 hover:text-blue-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Now
                </Link>
                <Link
                  to="/my-bookings"
                  className="text-gray-700 hover:text-blue-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>

                {isAuthenticated() ? (
                  <>
                    <div className="text-gray-700">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-left text-red-500 hover:text-red-600 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-blue-600 hover:text-blue-700 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 text-xl font-bold mb-4">
                <Car size={24} />
                <span>VehicleRental</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for vehicle rentals. Quality vehicles, affordable prices.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
                <Link to="/booking" className="text-gray-400 hover:text-white transition">
                  Book Now
                </Link>
                <Link to="/my-bookings" className="text-gray-400 hover:text-white transition">
                  My Bookings
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <div className="text-gray-400 space-y-2">
                <p>Email: support@vehiclerental.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Address: Lucknow, Uttar Pradesh, IN</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VehicleRental. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}