// src/controllers/vehiclesController.js
// Controller for vehicles endpoints

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/vehicles
 * Get all vehicles, optionally filtered by type
 * Query params: typeId (optional)
 */
async function getVehicles(req, res) {
  try {
    const { typeId } = req.query;

    const where = typeId ? { typeId: parseInt(typeId) } : {};

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        type: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * GET /api/vehicles/:id
 * Get a specific vehicle by ID
 */
async function getVehicleById(req, res) {
  try {
    const vehicleId = parseInt(req.params.id);

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        type: true,
        bookings: {
          where: {
            status: 'confirmed',
          },
          orderBy: { startDate: 'asc' },
        },
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        error: 'Vehicle not found',
      });
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

module.exports = {
  getVehicles,
  getVehicleById,
};