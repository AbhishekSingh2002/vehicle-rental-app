// src/controllers/bookingsController.js
// Express controller for booking endpoints

const bookingService = require('../services/bookingService');

/**
 * POST /api/bookings
 * Create a new booking
 */
async function createBooking(req, res) {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const booking = await bookingService.createBooking({
      userId: parseInt(req.user.id),
      vehicleId: parseInt(vehicleId),
      startDate,
      endDate,
    });

    const days = Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (24 * 60 * 60 * 1000)));
    const pricePerDay = booking?.vehicle?.metadata?.pricePerDay || 0;
    const totalAmount = days * pricePerDay;

    res.status(201).json({
      id: booking.id,
      vehicleId: booking.vehicleId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: booking.status,
      createdAt: booking.createdAt,
      totalAmount,
      vehicle: {
        name: booking.vehicle.name,
        type: booking.vehicle.type.name,
        metadata: booking.vehicle.metadata,
      },
    });
  } catch (error) {
    if (error.name === 'OverlapError') {
      return res.status(409).json({
        error: error.message,
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: error.message,
      });
    }

    console.error('Error creating booking:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * GET /api/bookings/:vehicleId
 * Get all bookings for a vehicle
 */
async function getVehicleBookings(req, res) {
  try {
    const vehicleId = parseInt(req.params.vehicleId);
    const bookings = await bookingService.getVehicleBookings(vehicleId);

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * GET /api/bookings/check-availability
 * Check if a vehicle is available for a date range
 */
async function checkAvailability(req, res) {
  try {
    const { vehicleId, startDate, endDate } = req.query;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({
        error: 'vehicleId, startDate, and endDate are required',
      });
    }

    const isAvailable = await bookingService.checkAvailability(
      parseInt(vehicleId),
      startDate,
      endDate
    );

    res.json({ available: isAvailable });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * PATCH /api/bookings/:id/cancel
 * Cancel a booking
 */
async function cancelBooking(req, res) {
  try {
    const bookingId = parseInt(req.params.id);
    const booking = await bookingService.cancelBooking(bookingId);

    res.json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * GET /api/bookings/my
 * Get all bookings for the authenticated user
 */
async function getMyBookings(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const bookings = await bookingService.getUserBookings(parseInt(req.user.id));
    const mapped = bookings.map((b) => {
      const days = Math.max(1, Math.ceil((new Date(b.endDate) - new Date(b.startDate)) / (24 * 60 * 60 * 1000)));
      const pricePerDay = b?.vehicle?.metadata?.pricePerDay || 0;
      const totalAmount = days * pricePerDay;
      return {
        ...b,
        totalAmount,
      };
    });
    res.json(mapped);
  } catch (error) {
    console.error('Error fetching my bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createBooking,
  getVehicleBookings,
  checkAvailability,
  cancelBooking,
  getMyBookings,
};