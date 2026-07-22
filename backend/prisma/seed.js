const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const DUMMY_VEHICLES = [
  {
    make: 'Tesla',
    model: 'Model 3 Performance',
    category: 'Electric',
    price: 48990,
    quantity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
  },
  {
    make: 'Porsche',
    model: '911 Carrera S',
    category: 'Coupe',
    price: 120500,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
  },
  {
    make: 'BMW',
    model: 'M3 Competition',
    category: 'Coupe',
    price: 76000,
    quantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
  },
  {
    make: 'Ford',
    model: 'Mustang GT',
    category: 'Coupe',
    price: 38300,
    quantity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80',
  },
  {
    make: 'Toyota',
    model: 'Camry XSE',
    category: 'Sedan',
    price: 28620,
    quantity: 9,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
  },
  {
    make: 'Range Rover',
    model: 'Sport HSE',
    category: 'SUV',
    price: 83600,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
  },
  {
    make: 'Ford',
    model: 'F-150 Raptor',
    category: 'Truck',
    price: 78385,
    quantity: 0, // Out of stock demo
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
  },
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

  console.log(`🚗 Seeded ${DUMMY_VEHICLES.length} vehicles with high-resolution image URLs successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
