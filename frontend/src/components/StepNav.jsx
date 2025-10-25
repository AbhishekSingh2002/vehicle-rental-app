import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const StepNav = ({ currentStep, totalSteps, onNext, onPrev, nextDisabled, nextLabel = 'Next', showNext = true, isLastStep = false }) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="mt-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <div>
          {currentStep > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ChevronLeft className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Back
            </button>
          )}
        </div>
        
        <div>
          {showNext && (
            <button
              type="button"
              onClick={onNext}
              disabled={nextDisabled}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                nextDisabled 
                  ? 'bg-blue-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLastStep ? (
                <>
                  <Check className="-ml-1 mr-2 h-5 w-5" />
                  Confirm Booking
                </>
              ) : (
                <>
                  {nextLabel}
                  <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepNav;