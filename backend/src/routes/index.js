// src/routes/index.js
// Main routes file combining all API routes

const express = require('express');
const typesController = require('../controllers/typesController');
const vehiclesController = require('../controllers/vehiclesController');
const bookingsController = require('../controllers/bookingsController');
const authRoutes = require('./authRoutes');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/wheels', typesController.getWheels);
router.get('/types', typesController.getTypes);
router.get('/vehicles', vehiclesController.getVehicles);
router.get('/vehicles/:id', vehiclesController.getVehicleById);
router.get('/bookings/check-availability', bookingsController.checkAvailability);
router.get('/bookings/vehicle/:vehicleId', bookingsController.getVehicleBookings);

// Auth routes (public)
router.use('/auth', authRoutes);

// Protected routes (require authentication)
router.use(authenticate);

// Protected booking routes
router.get('/bookings/my', bookingsController.getMyBookings);
router.post('/bookings', bookingsController.createBooking);
router.patch('/bookings/:id/cancel', bookingsController.cancelBooking);

module.exports = router;