// src/controllers/typesController.js
// Controller for vehicle types endpoints

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/types
 * Get all vehicle types, optionally filtered by wheel count
 * Query params: wheels (optional, 2 or 4)
 */
async function getTypes(req, res) {
  try {
    const { wheels } = req.query;

    const where = wheels ? { wheels: parseInt(wheels) } : {};

    const types = await prisma.vehicleType.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json(types);
  } catch (error) {
    console.error('Error fetching types:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * GET /api/wheels
 * Get distinct wheel counts available
 */
async function getWheels(req, res) {
  try {
    const types = await prisma.vehicleType.findMany({
      distinct: ['wheels'],
      select: { wheels: true },
      orderBy: { wheels: 'asc' },
    });

    const wheels = types.map((t) => t.wheels);
    res.json(wheels);
  } catch (error) {
    console.error('Error fetching wheels:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

module.exports = {
  getTypes,
  getWheels,
};