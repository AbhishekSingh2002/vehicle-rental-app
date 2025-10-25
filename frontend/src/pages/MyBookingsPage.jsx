// frontend/src/pages/MyBookingsPage.jsx
// Page to view user's bookings

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Car, Clock, XCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { formatDate, calculateDays } from '../utils/helpers';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const { bookings, loading, error, fetchMyBookings, cancelBooking } = useBooking();
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancelling(bookingId);
    const result = await cancelBooking(bookingId);
    setCancelling(null);

    if (result.success) {
      alert('Booking cancelled successfully!');
    } else {
      alert(`Failed to cancel booking: ${result.error}`);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status] || ''}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="mb-4 text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage your vehicle reservations</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Bookings Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start your journey by booking your first vehicle
            </p>
            <button
              onClick={() => navigate('/booking')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Car className="text-blue-600" size={24} />
                      <h3 className="text-xl font-semibold">
                        {booking.vehicle?.name || 'Vehicle'}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} />
                        <span>
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={18} />
                        <span>{calculateDays(booking.startDate, booking.endDate)} days</span>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-500">
                      Booking ID: #{booking.id}
                    </div>
                  </div>

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancelling === booking.id}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {cancelling === booking.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <XCircle size={18} />
                          Cancel Booking
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}