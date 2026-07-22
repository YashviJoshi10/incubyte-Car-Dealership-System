const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const DUMMY_VEHICLES = [
  {
    make: 'Tesla',
    model: 'Model 3 Performance',
    category: 'Electric',
    price: 6500000, // ₹65.0 Lakh
    quantity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    year: 2024,
    fuelType: 'Electric',
    transmission: 'Single-Speed Fixed',
    mileage: '507 km Range',
    seating: 5,
    description: 'High performance dual-motor AWD electric sedan delivering 0-100 km/h in 3.1 seconds with autopilot capabilities.',
  },
  {
    make: 'Porsche',
    model: '911 Carrera S',
    category: 'Coupe',
    price: 18500000, // ₹1.85 Crore
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    year: 2024,
    fuelType: 'Petrol',
    transmission: '8-Speed PDK',
    mileage: '11.2 km/l',
    seating: 4,
    description: 'Iconic rear-engine sports coupe powered by a 3.0L twin-turbo flat-six engine delivering 443 HP.',
  },
  {
    make: 'BMW',
    model: 'M3 Competition',
    category: 'Coupe',
    price: 13000000, // ₹1.30 Crore
    quantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    year: 2024,
    fuelType: 'Petrol',
    transmission: '8-Speed M Steptronic',
    mileage: '10.5 km/l',
    seating: 5,
    description: 'Track-inspired sports sedan featuring M TwinPower Turbo inline 6-cylinder engine with 503 HP and xDrive AWD.',
  },
  {
    make: 'Ford',
    model: 'Mustang GT',
    category: 'Coupe',
    price: 7500000, // ₹75.0 Lakh
    quantity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80',
    year: 2024,
    fuelType: 'Petrol',
    transmission: '10-Speed Automatic',
    mileage: '8.9 km/l',
    seating: 4,
    description: 'Legendary American muscle car with a naturally aspirated 5.0L Ti-VCT V8 engine generating 450 HP.',
  },
  {
    make: 'Toyota',
    model: 'Camry Hybrid XSE',
    category: 'Hybrid',
    price: 4600000, // ₹46.0 Lakh
    quantity: 9,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    year: 2024,
    fuelType: 'Hybrid (Petrol + Electric)',
    transmission: 'e-CVT Automatic',
    mileage: '23.2 km/l',
    seating: 5,
    description: 'Executive luxury hybrid sedan combining dynamic performance, ultra-quiet cabin, and incredible fuel efficiency.',
  },
  {
    make: 'Range Rover',
    model: 'Sport HSE',
    category: 'SUV',
    price: 16500000, // ₹1.65 Crore
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
    year: 2024,
    fuelType: 'Diesel Hybrid',
    transmission: '8-Speed Automatic',
    mileage: '13.8 km/l',
    seating: 5,
    description: 'Ultimate luxury performance SUV featuring Terrain Response 2, adaptive air suspension, and Meridian 3D sound.',
  },
  {
    make: 'Ford',
    model: 'F-150 Raptor',
    category: 'Truck',
    price: 11000000, // ₹1.10 Crore
    quantity: 0, // Sold out demo
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    year: 2024,
    fuelType: 'Petrol',
    transmission: '10-Speed Automatic',
    mileage: '7.5 km/l',
    seating: 5,
    description: 'High-speed off-road super truck with FOX Live Valve shocks and 3.5L Twin-Turbo EcoBoost V6 engine.',
  },
];

async function main() {
  console.log('🌱 Starting database seed with INR prices & detailed specs...');

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

  console.log(`🚗 Seeded ${DUMMY_VEHICLES.length} detailed vehicles with INR prices successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
