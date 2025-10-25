import React from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

const StepType = ({ typeId, types, onChange, loading, error }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading vehicle types...</p>
      </div>
    );
  }

  if (!types || types.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No vehicle types available. Please go back and select a different option.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Vehicle Type</h2>
        <p className="text-gray-600 mt-2">Select the category that matches your needs</p>
      </div>
      
      <div className="space-y-3">
        {types.map((type) => {
          const isSelected = typeId === type.id;
          
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange('typeId', type.id)}
              className={`w-full p-5 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
              }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-medium capitalize">{type.name}</div>
                  <div className="text-sm text-gray-500">
                    {type.wheels} {type.wheels === 1 ? 'wheel' : 'wheels'}
                  </div>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {!typeId && types.length > 0 && (
        <div className="text-sm text-gray-500 mt-4 text-center">
          Please select a vehicle type to continue
        </div>
      )}
    </div>
  );
};

export default StepType;