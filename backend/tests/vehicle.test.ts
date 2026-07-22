import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app';

const prisma = new PrismaClient();

let adminToken: string;
let userToken: string;

const vehiclePayload = {
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: 25000,
  quantity: 5,
};

// Set up shared tokens once
beforeAll(async () => {
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  await request(app)
    .post('/api/auth/register')
    .send({ email: 'admin@vehicle.com', password: 'password123', role: 'ADMIN' });
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@vehicle.com', password: 'password123' });
  adminToken = adminRes.body.token;

  await request(app)
    .post('/api/auth/register')
    .send({ email: 'user@vehicle.com', password: 'password123' });
  const userRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@vehicle.com', password: 'password123' });
  userToken = userRes.body.token;
});

beforeEach(async () => {
  await prisma.vehicle.deleteMany();
});

afterAll(async () => {
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

// ─────────────────────────────────────────────────────────────
// POST /api/vehicles
// ─────────────────────────────────────────────────────────────
describe('POST /api/vehicles', () => {
  it('should create a vehicle when called by admin', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(vehiclePayload);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.make).toBe('Toyota');
    expect(res.body.model).toBe('Camry');
    expect(res.body.category).toBe('Sedan');
    expect(res.body.price).toBe(25000);
    expect(res.body.quantity).toBe(5);
  });

  it('should return 403 when a regular user tries to create a vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send(vehiclePayload);

    expect(res.status).toBe(403);
  });

  it('should return 401 for unauthenticated request', async () => {
    const res = await request(app).post('/api/vehicles').send(vehiclePayload);
    expect(res.status).toBe(401);
  });

  it('should return 400 when make is missing', async () => {
    const { make, ...withoutMake } = vehiclePayload;
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(withoutMake);
    expect(res.status).toBe(400);
  });

  it('should return 400 for negative price', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...vehiclePayload, price: -100 });
    expect(res.status).toBe(400);
  });

  it('should return 400 for negative quantity', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...vehiclePayload, quantity: -1 });
    expect(res.status).toBe(400);
  });

  it('should return 400 for non-integer quantity', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...vehiclePayload, quantity: 1.5 });
    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────
// GET /api/vehicles
// ─────────────────────────────────────────────────────────────
describe('GET /api/vehicles', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(vehiclePayload);
  });

  it('should return all vehicles for authenticated user', async () => {
    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });

  it('should return all vehicles for authenticated admin', async () => {
    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(401);
  });

  it('should return empty array when no vehicles exist', async () => {
    await prisma.vehicle.deleteMany();
    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────
// GET /api/vehicles/search
// ─────────────────────────────────────────────────────────────
describe('GET /api/vehicles/search', () => {
  beforeEach(async () => {
    await request(app).post('/api/vehicles').set('Authorization', `Bearer ${adminToken}`).send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 });
    await request(app).post('/api/vehicles').set('Authorization', `Bearer ${adminToken}`).send({ make: 'Honda', model: 'Civic', category: 'Sedan', price: 20000, quantity: 3 });
    await request(app).post('/api/vehicles').set('Authorization', `Bearer ${adminToken}`).send({ make: 'Ford', model: 'F-150', category: 'Truck', price: 35000, quantity: 2 });
  });

  it('should search by make (case-insensitive)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=toyota')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].make).toBe('Toyota');
  });

  it('should search by model', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?model=civic')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].model).toBe('Civic');
  });

  it('should search by category (returns multiple)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?category=Sedan')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should search by minPrice', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?minPrice=30000')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].make).toBe('Ford');
  });

  it('should search by maxPrice', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?maxPrice=22000')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].make).toBe('Honda');
  });

  it('should search by price range', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?minPrice=20000&maxPrice=26000')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should return empty array for no matching results', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=Lamborghini')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it('should combine multiple filters (make + category)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=Toyota&category=Sedan')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/vehicles/search?make=Toyota');
    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────
// PUT /api/vehicles/:id
// ─────────────────────────────────────────────────────────────
describe('PUT /api/vehicles/:id', () => {
  let vehicleId: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(vehiclePayload);
    vehicleId = res.body.id;
  });

  it('should update a vehicle as admin', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 28000 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(28000);
    expect(res.body.make).toBe('Toyota'); // unchanged fields preserved
  });

  it('should update multiple fields at once', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 30000, category: 'Luxury Sedan' });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(30000);
    expect(res.body.category).toBe('Luxury Sedan');
  });

  it('should return 403 when regular user tries to update', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 28000 });

    expect(res.status).toBe(403);
  });

  it('should return 404 for non-existent vehicle', async () => {
    const res = await request(app)
      .put('/api/vehicles/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 28000 });

    expect(res.status).toBe(404);
  });

  it('should return 401 without token', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .send({ price: 28000 });
    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/vehicles/:id
// ─────────────────────────────────────────────────────────────
describe('DELETE /api/vehicles/:id', () => {
  let vehicleId: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(vehiclePayload);
    vehicleId = res.body.id;
  });

  it('should delete a vehicle as admin', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('vehicle should no longer exist after deletion', async () => {
    await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    const listRes = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(listRes.body).toHaveLength(0);
  });

  it('should return 403 when regular user tries to delete', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('should return 404 for non-existent vehicle', async () => {
    const res = await request(app)
      .delete('/api/vehicles/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).delete(`/api/vehicles/${vehicleId}`);
    expect(res.status).toBe(401);
  });
});
