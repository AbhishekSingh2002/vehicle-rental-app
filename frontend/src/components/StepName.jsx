import React from 'react';
import { User, AlertCircle } from 'lucide-react';

const StepName = ({ firstName, lastName, onChange, error }) => {
  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0 && 
                  firstName.length <= 50 && lastName.length <= 50;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h2 className="text-3xl font-bold text-gray-800">What's your name?</h2>
        <p className="text-gray-600 mt-2">Let's start with your details</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            maxLength={50}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            placeholder="Enter your first name"
            autoFocus
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {firstName.length}/50 characters
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            maxLength={50}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            placeholder="Enter your last name"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {lastName.length}/50 characters
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      <div className="text-sm text-gray-500 mt-4">
        {!isValid && (firstName || lastName) && 'Please enter both first and last name (max 50 characters each)'}
      </div>
    </div>
  );
};

export default StepName;