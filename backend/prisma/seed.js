const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const DUMMY_VEHICLES = [
  { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 26400, quantity: 8 },
  { make: 'Toyota', model: 'RAV4', category: 'SUV', price: 31500, quantity: 5 },
  { make: 'Honda', model: 'Civic', category: 'Sedan', price: 23950, quantity: 12 },
  { make: 'Honda', model: 'CR-V', category: 'SUV', price: 30100, quantity: 3 },
  { make: 'Ford', model: 'F-150', category: 'Truck', price: 38500, quantity: 4 },
  { make: 'Ford', model: 'Mustang', category: 'Coupe', price: 32500, quantity: 2 },
  { make: 'Chevrolet', model: 'Silverado 1500', category: 'Truck', price: 36800, quantity: 6 },
  { make: 'Tesla', model: 'Model 3', category: 'Electric', price: 38990, quantity: 7 },
  { make: 'Tesla', model: 'Model Y', category: 'Electric', price: 44990, quantity: 1 },
  { make: 'BMW', model: 'M3', category: 'Coupe', price: 76000, quantity: 2 },
  { make: 'Mercedes-Benz', model: 'C-Class', category: 'Sedan', price: 46850, quantity: 0 },
  { make: 'Hyundai', model: 'Tucson', category: 'SUV', price: 27500, quantity: 9 },
  { make: 'Toyota', model: 'Prius', category: 'Hybrid', price: 27950, quantity: 4 },
  { make: 'Porsche', model: '911 Carrera', category: 'Coupe', price: 114400, quantity: 1 },
  { make: 'Jeep', model: 'Wrangler', category: 'SUV', price: 33295, quantity: 0 }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
  const userPassword = await bcrypt.hash('user123', SALT_ROUNDS);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@dealership.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@dealership.com',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log(`✅ Created Admin user: ${admin.email} (password: admin123)`);
  console.log(`✅ Created Standard user: ${user.email} (password: user123)`);

  // Create Vehicles
  for (const vehicleData of DUMMY_VEHICLES) {
    await prisma.vehicle.create({
      data: vehicleData,
    });
  }

  console.log(`🚗 Seeded ${DUMMY_VEHICLES.length} vehicles successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
