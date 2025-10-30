// src/services/bookingService.js
// Handles booking creation with overlap prevention and transaction

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OverlapError extends Error {
  constructor(message = 'Requested dates overlap with an existing booking for this vehicle') {
    super(message);
    this.name = 'OverlapError';
    this.statusCode = 409;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

/**
 * Creates a booking with overlap prevention using database transaction
 * @param {Object} bookingData - The booking data
 * @param {number} bookingData.userId
 * @param {number} bookingData.vehicleId
 * @param {string} bookingData.startDate - ISO date string
 * @param {string} bookingData.endDate - ISO date string
 * @returns {Promise<Object>} Created booking
 */
async function createBooking(bookingData) {
  const { userId, vehicleId, startDate, endDate } = bookingData;

  // Validate inputs
  if (!userId || !vehicleId || !startDate || !endDate) {
    throw new ValidationError('All fields are required');
  }

  // Robust date parsing for YYYY-MM-DD to avoid timezone issues
  const start = typeof startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(startDate)
    ? new Date(`${startDate}T00:00:00Z`)
    : new Date(startDate);
  const end = typeof endDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(endDate)
    ? new Date(`${endDate}T00:00:00Z`)
    : new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new ValidationError('Invalid date format');
  }

  if (start > end) {
    throw new ValidationError('Start date must be before or equal to end date');
  }

  // Prevent booking in the past (compare using UTC midnight)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (start < today) {
    throw new ValidationError('Cannot book dates in the past');
  }

  // Use transaction to prevent race conditions
  const booking = await prisma.$transaction(async (tx) => {
    // 1. Check if vehicle exists
    const vehicle = await tx.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new ValidationError('Vehicle not found');
    }

    // 2. Check for overlapping bookings using raw SQL with FOR UPDATE lock
    const overlappingBookings = await tx.$queryRaw`
      SELECT id FROM "Booking"
      WHERE "vehicleId" = ${vehicleId}
        AND status = 'confirmed'
        AND NOT ("endDate" < ${start}::date OR "startDate" > ${end}::date)
      FOR UPDATE
    `;

    if (overlappingBookings.length > 0) {
      throw new OverlapError();
    }

    // 3. Create the booking
    const newBooking = await tx.booking.create({
      data: {
        userId,
        vehicleId,
        startDate: start,
        endDate: end,
        status: 'confirmed',
      },
      include: {
        vehicle: {
          include: {
            type: true,
          },
        },
      },
    });

    return newBooking;
  });

  return booking;
}

/**
 * Get all bookings for a specific vehicle
 * @param {number} vehicleId
 * @returns {Promise<Array>}
 */
async function getVehicleBookings(vehicleId) {
  return await prisma.booking.findMany({
    where: { vehicleId },
    orderBy: { startDate: 'asc' },
    include: {
      vehicle: true,
    },
  });
}

/**
 * Check vehicle availability for a date range
 * @param {number} vehicleId
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Promise<boolean>}
 */
async function checkAvailability(vehicleId, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const overlappingBookings = await prisma.booking.findFirst({
    where: {
      vehicleId,
      status: 'confirmed',
      AND: [
        { startDate: { lte: end } },
        { endDate: { gte: start } },
      ],
    },
  });

  return !overlappingBookings;
}

/**
 * Cancel a booking
 * @param {number} bookingId
 * @returns {Promise<Object>}
 */
async function cancelBooking(bookingId) {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'cancelled' },
  });
}

/**
 * Get bookings for the current user
 * @param {number} userId
 * @returns {Promise<Array>}
 */
async function getUserBookings(userId) {
  return await prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      vehicle: {
        include: { type: true },
      },
    },
  });
}

module.exports = {
  createBooking,
  getVehicleBookings,
  checkAvailability,
  cancelBooking,
  OverlapError,
  ValidationError,
  getUserBookings,
};