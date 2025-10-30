// src/index.js
// Express server bootstrap

const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('');
  console.log('🚗 Vehicle Rental API Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /api/wheels');
  console.log('  GET  /api/types?wheels={2|4}');
  console.log('  GET  /api/vehicles?typeId={id}');
  console.log('  GET  /api/vehicles/:id');
  console.log('  POST /api/bookings');
  console.log('  GET  /api/bookings/check-availability');
  console.log('  GET  /api/bookings/vehicle/:vehicleId');
  console.log('  PATCH /api/bookings/:id/cancel');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});