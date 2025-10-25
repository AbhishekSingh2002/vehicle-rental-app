import React from 'react';
import { Check, AlertCircle, User, Calendar, Car, Bike } from 'lucide-react';

const getVehicleIcon = (wheels) => {
  return wheels === 2 ? Bike : Car;
};

const ReviewItem = ({ icon: Icon, label, value, className = '' }) => (
  <div className={`flex items-start py-3 ${className}`}>
    <div className="flex-shrink-0">
      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
        <Icon className="h-5 w-5 text-blue-500" />
      </div>
    </div>
    <div className="ml-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  </div>
);

const StepReview = ({ state, types, vehicles, loading, error, onBook }) => {
  const selectedType = types.find(t => t.id === state.typeId);
  const selectedVehicle = vehicles.find(v => v.id === state.vehicleId);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not selected';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const calculateDuration = () => {
    if (!state.startDate || !state.endDate) return 'N/A';
    const start = new Date(state.startDate);
    const end = new Date(state.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
  };

  const VehicleIcon = selectedType ? getVehicleIcon(selectedType.wheels) : Car;
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Review Your Booking</h2>
        <p className="text-gray-600 mt-2">Please confirm your details before proceeding</p>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Summary</h3>
        
        <div className="border-t border-gray-200 pt-4">
          <ReviewItem 
            icon={User} 
            label="Name" 
            value={`${state.firstName} ${state.lastName}`} 
          />
          
          {selectedType && selectedVehicle && (
            <>
              <ReviewItem 
                icon={VehicleIcon}
                label="Vehicle" 
                className="mt-4"
                value={
                  <div>
                    <div className="font-medium">{selectedVehicle.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {selectedType.name.charAt(0).toUpperCase() + selectedType.name.slice(1)} • {selectedVehicle.metadata.color} • {selectedVehicle.metadata.year}
                    </div>
                  </div>
                } 
              />
            </>
          )}
          
          <ReviewItem 
            icon={Calendar}
            label="Rental Period" 
            className="mt-4"
            value={
              <div>
                <div className="font-medium">{formatDate(state.startDate)}</div>
                <div className="text-sm text-gray-500 mt-1">
                  to {formatDate(state.endDate)} • {calculateDuration()}
                </div>
              </div>
            } 
          />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <button
          type="button"
          onClick={onBook}
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Confirm Booking'
          )}
        </button>
        
        <p className="mt-2 text-xs text-gray-500 text-center">
          By confirming, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default StepReview;