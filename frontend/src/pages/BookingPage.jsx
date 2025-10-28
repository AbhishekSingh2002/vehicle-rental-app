// frontend/src/pages/BookingPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookingWizard from '../components/booking/BookingWizard';
import { ArrowLeft } from 'lucide-react';

export default function BookingPage() {
  const navigate = useNavigate();

  const handleBookingSuccess = () => {
    navigate('/my-bookings', { state: { bookingSuccess: true } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="container">
        {/* Top nav (minimal) */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:opacity-90 navbar-logo">
              <span className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full p-2 shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13l3-8h12l3 8v6a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H6v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                </svg>
              </span>
              <span className="text-lg font-semibold text-gray-800">VehicleRental</span>
            </Link>
          </div>

          <nav className="hidden sm:flex items-center gap-4 text-sm navbar-menu">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/book" className="navbar-link" style={{ color: 'var(--primary)' }}>Book Now</Link>
            <Link to="/my-bookings" className="navbar-link">My Bookings</Link>
            <Link to="/login" className="navbar-link">Login / Sign Up</Link>
          </nav>
        </header>

        {/* Card */}
        <main className="card overflow-hidden">
          {/* Header band */}
          <div className="card-header bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div>
                <h1 className="card-title text-white">Book Your Vehicle</h1>
                <p className="text-blue-100 text-sm">Complete your booking in a few simple steps</p>
              </div>
            </div>
          </div>

          {/* Wizard container */}
          <div className="p-6 md:p-8">
            <BookingWizard onSuccess={handleBookingSuccess} />
          </div>
        </main>

        {/* Footer area (compact) */}
        <footer className="mt-6 text-center text-sm text-gray-500">
          <div>© {new Date().getFullYear()} VehicleRental</div>
          <div className="mt-1">Your trusted partner for vehicle rentals — clean, reliable, and affordable.</div>
        </footer>
      </div>
    </div>
  );
}
