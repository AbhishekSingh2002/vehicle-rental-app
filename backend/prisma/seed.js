// prisma/seed.js
// Add to package.json: "prisma": { "seed": "node prisma/seed.js" }
// Run: npm run seed

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (optional - remove if you want to preserve data)
  await prisma.booking.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.vehicleType.deleteMany({});

  // Create Vehicle Types
  console.log('Creating vehicle types...');
  
  const hatchback = await prisma.vehicleType.create({
    data: {
      name: 'hatchback',
      wheels: 4,
    },
  });

  const sedan = await prisma.vehicleType.create({
    data: {
      name: 'sedan',
      wheels: 4,
    },
  });

  const suv = await prisma.vehicleType.create({
    data: {
      name: 'suv',
      wheels: 4,
    },
  });

  const cruiser = await prisma.vehicleType.create({
    data: {
      name: 'cruiser',
      wheels: 2,
    },
  });

  console.log('✅ Vehicle types created');

  // Create Vehicles
  console.log('Creating vehicles...');

  // Hatchbacks
  await prisma.vehicle.createMany({
    data: [
      {
        name: 'Hyundai i10',
        registrationNumber: 'UP32AB1234',
        typeId: hatchback.id,
        metadata: { color: 'White', year: 2024, fuelType: 'Petrol', pricePerDay: 1200 },
      },
      {
        name: 'Tata Tiago',
        registrationNumber: 'UP32CD5678',
        typeId: hatchback.id,
        metadata: { color: 'Blue', year: 2023, fuelType: 'Petrol', pricePerDay: 1100 },
      },
    ],
  });

  // Sedans
  await prisma.vehicle.createMany({
    data: [
      {
        name: 'Honda City',
        registrationNumber: 'UP32EF9012',
        typeId: sedan.id,
        metadata: { color: 'Silver', year: 2024, fuelType: 'Petrol', pricePerDay: 2000 },
      },
      {
        name: 'Maruti Ciaz',
        registrationNumber: 'UP32GH3456',
        typeId: sedan.id,
        metadata: { color: 'Grey', year: 2023, fuelType: 'Diesel', pricePerDay: 1800 },
      },
    ],
  });

  // SUVs
  await prisma.vehicle.createMany({
    data: [
      {
        name: 'Mahindra XUV700',
        registrationNumber: 'UP32IJ7890',
        typeId: suv.id,
        metadata: { color: 'Black', year: 2024, fuelType: 'Diesel', pricePerDay: 3000 },
      },
      {
        name: 'Kia Seltos',
        registrationNumber: 'UP32KL1234',
        typeId: suv.id,
        metadata: { color: 'White', year: 2024, fuelType: 'Petrol', pricePerDay: 2600 },
      },
    ],
  });

  // Cruisers (Bikes)
  await prisma.vehicle.createMany({
    data: [
      {
        name: 'Royal Enfield Classic 350',
        registrationNumber: 'UP32MN5678',
        typeId: cruiser.id,
        metadata: { color: 'Black', year: 2024, fuelType: 'Petrol', pricePerDay: 900 },
      },
      {
        name: 'Honda Activa 6G',
        registrationNumber: 'UP32OP9012',
        typeId: cruiser.id,
        metadata: { color: 'Red', year: 2024, fuelType: 'Petrol', pricePerDay: 600 },
      },
    ],
  });

  console.log('✅ Vehicles created');

  // Get counts
  const typesCount = await prisma.vehicleType.count();
  const vehiclesCount = await prisma.vehicle.count();

  console.log('');
  console.log('📊 Seed Summary:');
  console.log(`   Vehicle Types: ${typesCount}`);
  console.log(`   Vehicles: ${vehiclesCount}`);
  console.log('');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });