// frontend/src/services/api.js
// Mock API service for development

// Mock data
const mockTypes = {
  2: [
    { id: 1, name: 'Cruiser', wheels: 2 },
    { id: 2, name: 'Sport Bike', wheels: 2 },
    { id: 3, name: 'Scooter', wheels: 2 }
  ],
  4: [
    { id: 4, name: 'Hatchback', wheels: 4 },
    { id: 5, name: 'Sedan', wheels: 4 },
    { id: 6, name: 'SUV', wheels: 4 }
  ]
};

const mockVehicles = {
  1: [
    { id: 1, name: 'Honda Rebel 500', typeId: 1, price: 50 },
    { id: 2, name: 'Harley Street 750', typeId: 1, price: 70 }
  ],
  2: [
    { id: 3, name: 'Kawasaki Ninja 400', typeId: 2, price: 60 },
    { id: 4, name: 'Yamaha R3', typeId: 2, price: 65 }
  ],
  3: [
    { id: 5, name: 'Honda PCX150', typeId: 3, price: 40 },
    { id: 6, name: 'Vespa Primavera', typeId: 3, price: 45 }
  ],
  4: [
    { id: 7, name: 'Toyota Yaris', typeId: 4, price: 80 },
    { id: 8, name: 'Honda Fit', typeId: 4, price: 75 }
  ],
  5: [
    { id: 9, name: 'Toyota Camry', typeId: 5, price: 100 },
    { id: 10, name: 'Honda Accord', typeId: 5, price: 95 }
  ],
  6: [
    { id: 11, name: 'Toyota RAV4', typeId: 6, price: 120 },
    { id: 12, name: 'Honda CR-V', typeId: 6, price: 125 }
  ]
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get vehicle types by number of wheels
 * @param {number} wheels - 2 or 4
 * @returns {Promise<Array>} Vehicle types
 */
export async function getTypes(wheels) {
  await delay(300);
  return mockTypes[wheels] || [];
}

/**
 * Get vehicles by type ID
 * @param {number} typeId - Type ID
 * @returns {Promise<Array>} Vehicles
 */
export async function getVehicles(typeId) {
  await delay(300);
  return mockVehicles[typeId] || [];
}

/**
 * Get available wheel counts
 * @returns {Promise<Array<number>>} Array of wheel counts [2, 4]
 */
export async function getWheels() {
  await delay(100);
  return [2, 4];
}

/**
 * Create a new booking
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} Created booking
 */
export async function createBooking(bookingData) {
  await delay(500);
  
  // Simulate 10% chance of overlap error
  if (Math.random() < 0.1) {
    const error = new Error('Requested dates overlap with an existing booking for this vehicle');
    error.status = 409;
    throw error;
  }
  
  return {
    id: Math.floor(Math.random() * 1000),
    ...bookingData,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
}

/**
 * Check if a vehicle is available for given dates
 * @param {number} vehicleId
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @returns {Promise<{available: boolean}>}
 */
export async function checkAvailability(vehicleId, startDate, endDate) {
  await delay(200);
  return { available: Math.random() > 0.1 }; // 90% chance of being available
}

// Not used in the current implementation but kept for completeness
export async function getVehicleBookings() {
  await delay(300);
  return [];
}

export async function cancelBooking() {
  await delay(300);
  return { success: true };
}

const api = {
  getTypes,
  getVehicles,
  getWheels,
  createBooking,
  checkAvailability,
  getVehicleBookings,
  cancelBooking,
};

export default api;