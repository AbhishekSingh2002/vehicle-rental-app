// frontend/src/utils/validation.js
// Validation utility functions

/**
 * Validate name input
 * @param {string} name
 * @returns {{isValid: boolean, error: string|null}}
 */
export function validateName(name) {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Name is required',
    };
  }
  
  if (name.length > 50) {
    return {
      isValid: false,
      error: 'Name must be 50 characters or less',
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate full name (first and last)
 * @param {string} firstName
 * @param {string} lastName
 * @returns {{isValid: boolean, error: string|null}}
 */
export function validateFullName(firstName, lastName) {
  const firstNameValidation = validateName(firstName);
  if (!firstNameValidation.isValid) {
    return {
      isValid: false,
      error: `First name: ${firstNameValidation.error}`,
    };
  }
  
  const lastNameValidation = validateName(lastName);
  if (!lastNameValidation.isValid) {
    return {
      isValid: false,
      error: `Last name: ${lastNameValidation.error}`,
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate date range
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @returns {{isValid: boolean, error: string|null}}
 */
export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return {
      isValid: false,
      error: 'Both start and end dates are required',
    };
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isValid: false,
      error: 'Invalid date format',
    };
  }
  
  if (start < today) {
    return {
      isValid: false,
      error: 'Start date cannot be in the past',
    };
  }
  
  if (end < start) {
    return {
      isValid: false,
      error: 'End date must be on or after start date',
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate vehicle selection
 * @param {number|null} vehicleId
 * @returns {{isValid: boolean, error: string|null}}
 */
export function validateVehicleSelection(vehicleId) {
  if (!vehicleId || vehicleId <= 0) {
    return {
      isValid: false,
      error: 'Please select a vehicle',
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate wheel selection
 * @param {number|null} wheels
 * @returns {{isValid: boolean, error: string|null}}
 */
export function validateWheelSelection(wheels) {
  if (!wheels || (wheels !== 2 && wheels !== 4)) {
    return {
      isValid: false,
      error: 'Please select number of wheels',
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate type selection
 * @param {number|null} typeId
 * @returns {{isValid: boolean, error: string|null}}
 */
export function validateTypeSelection(typeId) {
  if (!typeId || typeId <= 0) {
    return {
      isValid: false,
      error: 'Please select a vehicle type',
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate complete booking data
 * @param {Object} bookingData
 * @returns {{isValid: boolean, errors: Array<string>}}
 */
export function validateBooking(bookingData) {
  const errors = [];
  
  // Validate names
  const nameValidation = validateFullName(
    bookingData.firstName,
    bookingData.lastName
  );
  if (!nameValidation.isValid) {
    errors.push(nameValidation.error);
  }
  
  // Validate wheel selection
  const wheelValidation = validateWheelSelection(bookingData.wheels);
  if (!wheelValidation.isValid) {
    errors.push(wheelValidation.error);
  }
  
  // Validate type selection
  const typeValidation = validateTypeSelection(bookingData.typeId);
  if (!typeValidation.isValid) {
    errors.push(typeValidation.error);
  }
  
  // Validate vehicle selection
  const vehicleValidation = validateVehicleSelection(bookingData.vehicleId);
  if (!vehicleValidation.isValid) {
    errors.push(vehicleValidation.error);
  }
  
  // Validate date range
  const dateValidation = validateDateRange(
    bookingData.startDate,
    bookingData.endDate
  );
  if (!dateValidation.isValid) {
    errors.push(dateValidation.error);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default {
  validateName,
  validateFullName,
  validateDateRange,
  validateVehicleSelection,
  validateWheelSelection,
  validateTypeSelection,
  validateBooking,
};