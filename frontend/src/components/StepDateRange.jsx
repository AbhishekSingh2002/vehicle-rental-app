import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

const StepDateRange = ({ startDate, endDate, onChange, error, isVehicleAvailable }) => {
  const today = new Date().toISOString().split('T')[0];
  const [localError, setLocalError] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  // Calculate min/max dates
  const minEndDate = startDate > today ? startDate : today;
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Validate dates when they change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const todayDate = new Date(today);
      
      if (start < todayDate) {
        setLocalError('Start date cannot be in the past');
      } else if (end < start) {
        setLocalError('End date must be after start date');
      } else {
        setLocalError(null);
      }
    }
  }, [startDate, endDate, today]);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    onChange('startDate', newStartDate);
    
    // Reset end date if it's before the new start date
    if (endDate && newStartDate > endDate) {
      onChange('endDate', '');
    }
  };

  const handleEndDateChange = (e) => {
    onChange('endDate', e.target.value);
  };

  const isDateRangeValid = () => {
    if (!startDate || !endDate) return false;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const todayDate = new Date(today);
    
    return start >= todayDate && end > start;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Select Dates</h2>
        <p className="text-gray-600 mt-2">Choose your rental period</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            min={today}
            max={maxDateStr}
            onChange={handleStartDateChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            min={minEndDate}
            max={maxDateStr}
            onChange={handleEndDateChange}
            disabled={!startDate}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
              !startDate 
                ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
                : 'border-gray-300 focus:border-blue-500'
            }`}
          />
        </div>
        
        {isDateRangeValid() && (
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="font-medium">Duration:</span>
              <span className="ml-1">
                {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>
            {isVehicleAvailable === false && (
              <div className="mt-1 text-yellow-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                This vehicle may not be available for the selected dates
              </div>
            )}
          </div>
        )}
      </div>
      
      {(error || localError) && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error || localError}</p>
          </div>
        </div>
      )}
      
      {!startDate && !endDate && (
        <div className="text-sm text-gray-500 mt-4 text-center">
          Please select your rental dates
        </div>
      )}
    </div>
  );
};

export default StepDateRange;