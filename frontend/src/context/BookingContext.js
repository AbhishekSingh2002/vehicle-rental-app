// frontend/src/context/BookingContext.js
// Booking context for managing booking state across the app

import React, { createContext, useContext, useState } from 'react';
import * as api from '../services/api';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a new booking
  const createBooking = async (bookingData) => {
    setLoading(true);
    setError(null);
    
    try {
      const booking = await api.createBooking(bookingData);
      setCurrentBooking(booking);
      setBookings(prev => [...prev, booking]);
      return { success: true, booking };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create booking';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's bookings
  const fetchMyBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // For now, return empty array as we don't have user-specific bookings
      const userBookings = [];
      setBookings(userBookings);
      return { success: true, bookings: userBookings };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch bookings';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId) => {
    setLoading(true);
    setError(null);
    
    try {
      const cancelledBooking = await api.cancelBooking(bookingId);
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? cancelledBooking : b))
      );
      return { success: true, booking: cancelledBooking };
    } catch (err) {
      const errorMessage = err.message || 'Failed to cancel booking';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Check vehicle availability
  const checkAvailability = async (vehicleId, startDate, endDate) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.checkAvailability(vehicleId, startDate, endDate);
      return { success: true, available: result.available };
    } catch (err) {
      const errorMessage = err.message || 'Failed to check availability';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear current booking
  const clearCurrentBooking = () => {
    setCurrentBooking(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    currentBooking,
    bookings,
    loading,
    error,
    createBooking,
    fetchMyBookings,
    cancelBooking,
    checkAvailability,
    clearCurrentBooking,
    clearError,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook to use booking context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;