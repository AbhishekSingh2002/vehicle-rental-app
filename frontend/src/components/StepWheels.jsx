import React from 'react';
import { Bike, Car, AlertCircle } from 'lucide-react';

const StepWheels = ({ wheels, onChange, error }) => {
  const options = [
    { value: 2, icon: Bike, label: 'Bike', description: '2 Wheeler' },
    { value: 4, icon: Car, label: 'Car', description: '4 Wheeler' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Number of wheels?</h2>
        <p className="text-gray-600 mt-2">Choose your preferred vehicle type</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = wheels === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange('wheels', option.value)}
              className={`p-6 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                  : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
              }`}
              aria-pressed={isSelected}
            >
              <div className="flex flex-col items-center text-center">
                <Icon 
                  className={`w-12 h-12 mb-3 transition-colors ${
                    isSelected ? 'text-blue-500' : 'text-gray-600'
                  }`} 
                />
                <div className="text-lg font-semibold text-gray-800">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
                {isSelected && (
                  <div className="mt-2 text-sm text-blue-600 font-medium">
                    Selected
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
    </div>
  );
};

export default StepWheels;