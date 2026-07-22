# API Documentation – Car Dealership Inventory System

Base URL: `http://localhost:3000/api`

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication

### POST /api/auth/register

Register a new user.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "USER"
}
```

- `role`: Optional. `"USER"` (default) or `"ADMIN"`
- `password`: Minimum 6 characters

**Response 201**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Errors**
- `400` – Validation error (invalid email, short password, invalid role)
- `409` – Email already registered

---

### POST /api/auth/login

Login and receive a JWT token.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response 200**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

**Errors**
- `400` – Validation error
- `401` – Invalid credentials

---

## Vehicles

### GET /api/vehicles

Get all vehicles (newest first).

**Auth**: Required  
**Role**: Any

**Response 200**
```json
[
  {
    "id": "uuid",
    "make": "Toyota",
    "model": "Camry",
    "category": "Sedan",
    "price": 25000,
    "quantity": 5,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### GET /api/vehicles/search

Search vehicles with optional filters.

**Auth**: Required  
**Role**: Any

**Query Parameters** (all optional)

| Param | Type | Description |
|-------|------|-------------|
| `make` | string | Case-insensitive partial match |
| `model` | string | Case-insensitive partial match |
| `category` | string | Case-insensitive partial match |
| `minPrice` | number | Minimum price (inclusive) |
| `maxPrice` | number | Maximum price (inclusive) |

**Example**
```
GET /api/vehicles/search?make=toyota&category=Sedan&minPrice=20000&maxPrice=30000
```

**Response 200** – Array of matching vehicles

---

### POST /api/vehicles

Create a new vehicle.

**Auth**: Required  
**Role**: Admin only

**Request Body**
```json
{
  "make": "Toyota",
  "model": "Camry",
  "category": "Sedan",
  "price": 25000,
  "quantity": 5
}
```

All fields required. `price` must be positive. `quantity` must be a non-negative integer.

**Response 201** – Created vehicle object

**Errors**
- `400` – Validation error
- `401` – Unauthorized
- `403` – Admin required

---

### PUT /api/vehicles/:id

Update an existing vehicle.

**Auth**: Required  
**Role**: Admin only

**Request Body** (all fields optional, at least one required)
```json
{
  "price": 28000,
  "quantity": 10
}
```

**Response 200** – Updated vehicle object

**Errors**
- `400` – Validation error
- `401` – Unauthorized
- `403` – Admin required
- `404` – Vehicle not found

---

### DELETE /api/vehicles/:id

Delete a vehicle.

**Auth**: Required  
**Role**: Admin only

**Response 200**
```json
{ "message": "Vehicle deleted successfully" }
```

**Errors**
- `401` – Unauthorized
- `403` – Admin required
- `404` – Vehicle not found

---

## Inventory

### POST /api/vehicles/:id/purchase

Purchase a vehicle (decrements quantity by 1).

**Auth**: Required  
**Role**: Any authenticated user

**Response 200**
```json
{
  "message": "Purchase successful",
  "vehicle": { ...updated vehicle }
}
```

**Errors**
- `400` – Vehicle is out of stock
- `401` – Unauthorized
- `404` – Vehicle not found

---

### POST /api/vehicles/:id/restock

Restock a vehicle (increments quantity).

**Auth**: Required  
**Role**: Admin only

**Request Body**
```json
{
  "quantity": 10
}
```

`quantity` must be a positive integer.

**Response 200**
```json
{
  "message": "Restock successful",
  "vehicle": { ...updated vehicle }
}
```

**Errors**
- `400` – Validation error (zero or negative quantity)
- `401` – Unauthorized
- `403` – Admin required
- `404` – Vehicle not found

---

## Error Response Format

All errors return:
```json
{ "error": "Human-readable error message" }
```

Validation errors additionally include:
```json
{
  "error": "Validation error",
  "details": [
    { "field": "body.price", "message": "Price must be positive" }
  ]
}
```
