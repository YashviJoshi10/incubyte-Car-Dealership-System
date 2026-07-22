const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../src/app');

const prisma = new PrismaClient();

let adminToken;
let userToken;

beforeAll(async () => {
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  await request(app)
    .post('/api/auth/register')
    .send({ email: 'admin@inv.com', password: 'password123', role: 'ADMIN' });
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@inv.com', password: 'password123' });
  adminToken = adminRes.body.token;

  await request(app)
    .post('/api/auth/register')
    .send({ email: 'user@inv.com', password: 'password123' });
  const userRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@inv.com', password: 'password123' });
  userToken = userRes.body.token;
});

afterAll(async () => {
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

async function createVehicle(quantity = 2) {
  const res = await request(app)
    .post('/api/vehicles')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity });
  return res.body;
}

// ─────────────────────────────────────────────────────────────
// POST /api/vehicles/:id/purchase
// ─────────────────────────────────────────────────────────────
describe('POST /api/vehicles/:id/purchase', () => {
  afterEach(async () => {
    await prisma.vehicle.deleteMany();
  });

  it('should purchase a vehicle and decrease quantity by 1', async () => {
    const vehicle = await createVehicle(3);
    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/purchase successful/i);
    expect(res.body.vehicle.quantity).toBe(2);
  });

  it('quantity in DB should be decremented after purchase', async () => {
    const vehicle = await createVehicle(3);
    await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    const dbVehicle = await prisma.vehicle.findUnique({ where: { id: vehicle.id } });
    expect(dbVehicle.quantity).toBe(2);
  });

  it('should allow admin to purchase a vehicle', async () => {
    const vehicle = await createVehicle(2);
    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.vehicle.quantity).toBe(1);
  });

  it('should allow multiple purchases until stock reaches 0', async () => {
    const vehicle = await createVehicle(2);

    const res1 = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res1.status).toBe(200);
    expect(res1.body.vehicle.quantity).toBe(1);

    const res2 = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res2.status).toBe(200);
    expect(res2.body.vehicle.quantity).toBe(0);
  });

  it('should return 400 when vehicle is out of stock', async () => {
    const vehicle = await createVehicle(1);

    await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/out of stock/i);
  });

  it('should prevent purchase when quantity is already 0', async () => {
    const vehicle = await createVehicle(0);
    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existent vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles/00000000-0000-0000-0000-000000000000/purchase')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(404);
  });

  it('should return 401 without token', async () => {
    const vehicle = await createVehicle(2);
    const res = await request(app).post(`/api/vehicles/${vehicle.id}/purchase`);
    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────
// POST /api/vehicles/:id/restock
// ─────────────────────────────────────────────────────────────
describe('POST /api/vehicles/:id/restock', () => {
  afterEach(async () => {
    await prisma.vehicle.deleteMany();
  });

  it('should restock a vehicle as admin', async () => {
    const vehicle = await createVehicle(2);
    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 10 });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/restock successful/i);
    expect(res.body.vehicle.quantity).toBe(12);
  });

  it('quantity in DB should be incremented after restock', async () => {
    const vehicle = await createVehicle(2);
    await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    const dbVehicle = await prisma.vehicle.findUnique({ where: { id: vehicle.id } });
    expect(dbVehicle.quantity).toBe(7);
  });

  it('should restock a vehicle that was out of stock', async () => {
    const vehicle = await createVehicle(0);
    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 20 });

    expect(res.status).toBe(200);
    expect(res.body.vehicle.quantity).toBe(20);
  });

  it('should return 403 when regular user tries to restock', async () => {
    const vehicle = await createVehicle(2);
    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 10 });

    expect(res.status).toBe(403);
  });

  it('should return 400 for zero quantity', async () => {
    const vehicle = await createVehicle(2);
    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 0 });

    expect(res.status).toBe(400);
  });

  it('should return 400 for negative quantity', async () => {
    const vehicle = await createVehicle(2);
    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: -5 });

    expect(res.status).toBe(400);
  });

  it('should return 400 when quantity is missing', async () => {
    const vehicle = await createVehicle(2);
    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existent vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles/00000000-0000-0000-0000-000000000000/restock')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 10 });

    expect(res.status).toBe(404);
  });

  it('should return 401 without token', async () => {
    const vehicle = await createVehicle(2);
    const res = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .send({ quantity: 10 });
    expect(res.status).toBe(401);
  });
});
