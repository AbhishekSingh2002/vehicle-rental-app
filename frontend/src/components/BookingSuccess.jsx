import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';

const BookingSuccess = ({ booking, onReset }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const calculateDuration = () => {
    if (!booking.startDate || !booking.endDate) return '';
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
  };

  return (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-50 mb-6">
        <CheckCircle className="h-12 w-12 text-green-500" aria-hidden="true" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
      <p className="text-lg text-gray-600 mb-8">Your reservation has been successfully created</p>
      
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden max-w-md mx-auto mb-8">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
          <p className="mt-1 text-sm text-gray-500">Reference: <span className="font-mono font-semibold">#{booking.id}</span></p>
        </div>
        
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Dates</p>
              <p className="text-sm text-gray-900">
                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              </p>
              <p className="text-sm text-gray-500 mt-1">{calculateDuration()}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="flex items-center">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pickup Location</p>
              <p className="text-sm text-gray-900">123 Main St, City Center</p>
              <p className="text-xs text-gray-500 mt-1">Please bring your driver's license and payment method</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between text-sm font-medium text-gray-900">
              <p>Total Amount</p>
              <p>$350.00</p>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <CreditCard className="h-4 w-4 mr-1" />
              <p>Paid with credit card ending in 4242</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <button
          type="button"
          onClick={onReset}
          className="w-full max-w-xs mx-auto flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Make Another Booking
        </button>
        
        <div className="text-sm">
          <p className="text-gray-500">Need help? <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Contact support</a></p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;