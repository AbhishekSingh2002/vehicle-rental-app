import React from 'react';
import { Check, AlertCircle, Loader2, Car, Bike } from 'lucide-react';

const getVehicleIcon = (type) => {
  switch (type) {
    case 'bike':
      return Bike;
    case 'car':
    default:
      return Car;
  }
};

const VehicleCard = ({ vehicle, isSelected, isAvailable = true, onClick }) => {
  const Icon = getVehicleIcon(vehicle.type);
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isAvailable}
      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : isAvailable
          ? 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
          : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
      }`}
      aria-pressed={isSelected}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className={`w-8 h-8 ${isSelected ? 'text-blue-500' : 'text-gray-500'}`} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900 truncate">{vehicle.name}</h3>
            {isSelected && (
              <div className="flex-shrink-0 ml-2">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-blue-600" />
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-1 text-sm text-gray-500 space-y-1">
            {vehicle.metadata.color && (
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: vehicle.metadata.color.toLowerCase() }} />
                {vehicle.metadata.color}
              </div>
            )}
            {vehicle.metadata.year && (
              <div>Year: {vehicle.metadata.year}</div>
            )}
          </div>
          
          {!isAvailable && (
            <div className="mt-2 text-sm text-yellow-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Not available for selected dates
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

const StepModel = ({ vehicleId, vehicles, loading, error, isVehicleAvailable, onChange }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading available models...</p>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No vehicles available. Please go back and select a different type.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Choose a Model</h2>
        <p className="text-gray-600 mt-2">Select your preferred vehicle</p>
      </div>
      
      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={vehicleId === vehicle.id}
            isAvailable={isVehicleAvailable()}
            onClick={() => onChange('vehicleId', vehicle.id)}
          />
        ))}
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {!vehicleId && vehicles.length > 0 && (
        <div className="text-sm text-gray-500 mt-4 text-center">
          Please select a vehicle to continue
        </div>
      )}
    </div>
  );
};

export default StepModel;