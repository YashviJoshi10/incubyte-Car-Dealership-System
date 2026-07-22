# Test Suite Report – Car Dealership Inventory System

This document contains the official test report, test suite breakdown, code coverage metrics, and test isolation strategy for the Car Dealership Inventory System REST API.

---

## 📊 Executive Test Summary

| Metric | Result |
|---|---|
| **Total Test Suites** | **3 Passed** / 3 Total (100%) |
| **Total Test Cases** | **66 Passed** / 66 Total (100%) |
| **Statement Coverage** | **94.89%** |
| **Line Coverage** | **94.84%** |
| **Function Coverage** | **93.75%** |
| **Branch Coverage** | **88.70%** |
| **Execution Environment** | Node.js + Jest + Supertest + PostgreSQL (`incubyte_car_dealership_test`) |
| **Execution Time** | ~4.3 seconds |

---

## 📈 Code Coverage Breakdown

```
--------------------------|---------|----------|---------|---------|-------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------------|---------|----------|---------|---------|-------------------
All files                 |   94.89 |     88.7 |   93.75 |   94.84 |                   
 src                      |   86.66 |      100 |       0 |   86.66 |                   
  app.js                  |   86.66 |      100 |       0 |   86.66 | 14,22             
 src/config               |    87.5 |     62.5 |     100 |    87.5 |                   
  env.js                  |      80 |       50 |     100 |      80 | 16-17             
  prisma.js               |     100 |    66.66 |     100 |     100 |                   
 src/controllers          |   93.61 |      100 |     100 |   93.61 |                   
  auth.controller.js      |     100 |      100 |     100 |     100 |                   
  inventory.controller.js |     100 |      100 |     100 |     100 |                   
  vehicle.controller.js   |      88 |      100 |     100 |      88 | 9,26,35           
 src/middleware           |   88.23 |       70 |     100 |   88.23 |                   
  auth.middleware.js      |     100 |      100 |     100 |     100 |                   
  error.middleware.js     |   66.66 |       50 |     100 |   66.66 | 19-24             
  validate.middleware.js  |     100 |      100 |     100 |     100 |                   
 src/repositories         |   94.11 |      100 |    90.9 |   94.11 |                   
  user.repository.js      |   83.33 |      100 |   66.66 |   83.33 | 9                 
  vehicle.repository.js   |     100 |      100 |     100 |     100 |                   
 src/routes               |     100 |      100 |     100 |     100 |                   
  auth.routes.js          |     100 |      100 |     100 |     100 |                   
  index.js                |     100 |      100 |     100 |     100 |                   
  vehicle.routes.js       |     100 |      100 |     100 |     100 |                   
 src/services             |     100 |      100 |     100 |     100 |                   
  auth.service.js         |     100 |      100 |     100 |     100 |                   
  inventory.service.js    |     100 |      100 |     100 |     100 |                   
  vehicle.service.js      |     100 |      100 |     100 |     100 |                   
 src/types                |     100 |       50 |     100 |     100 |                   
  AppError.js             |     100 |       50 |     100 |     100 |                   
 src/validators           |     100 |      100 |     100 |     100 |                   
  auth.validator.js       |     100 |      100 |     100 |     100 |                   
  vehicle.validator.js    |     100 |      100 |     100 |     100 |                   
--------------------------|---------|----------|---------|---------|-------------------
```

---

## 🧪 Detailed Test Case Inventory (66 Tests)

### 1. Authentication & Authorization Suite (`tests/auth.test.js` – 16 Tests)
- `POST /api/auth/register`
  - ✅ Should register a new USER by default
  - ✅ Should register an ADMIN when role is specified
  - ✅ Should not expose password hash in response
  - ✅ Should return 409 Conflict when email is already registered
  - ✅ Should return 400 Bad Request for invalid email format
  - ✅ Should return 400 Bad Request when password is too short (< 6 chars)
  - ✅ Should return 400 Bad Request when email is missing
  - ✅ Should return 400 Bad Request when password is missing
  - ✅ Should return 400 Bad Request for invalid role value
- `POST /api/auth/login`
  - ✅ Should login successfully with valid credentials and return JWT
  - ✅ Should not expose password hash in login response
  - ✅ Should return 401 Unauthorized for wrong password
  - ✅ Should return 401 Unauthorized for non-existent email
  - ✅ Should return 400 Bad Request when email is missing
  - ✅ Should return 400 Bad Request when password is missing
  - ✅ Should return a valid JWT token structure
- `Protected Route Access`
  - ✅ Should return 401 Unauthorized when no token is provided
  - ✅ Should return 401 Unauthorized for malformed token
  - ✅ Should return 401 Unauthorized for missing Bearer prefix

### 2. Vehicle Management Suite (`tests/vehicle.test.js` – 22 Tests)
- `POST /api/vehicles` (Admin Only)
  - ✅ Should create a vehicle when called by admin
  - ✅ Should return 403 Forbidden when a regular user tries to create a vehicle
  - ✅ Should return 401 Unauthorized for unauthenticated request
  - ✅ Should return 400 Bad Request when make is missing
  - ✅ Should return 400 Bad Request for negative price
  - ✅ Should return 400 Bad Request for negative quantity
  - ✅ Should return 400 Bad Request for non-integer quantity
- `GET /api/vehicles`
  - ✅ Should return all vehicles for authenticated user
  - ✅ Should return all vehicles for authenticated admin
  - ✅ Should return 401 Unauthorized without token
  - ✅ Should return empty array when no vehicles exist
- `GET /api/vehicles/search`
  - ✅ Should search by make (case-insensitive)
  - ✅ Should search by model
  - ✅ Should search by category
  - ✅ Should search by minPrice
  - ✅ Should search by maxPrice
  - ✅ Should search by price range (minPrice + maxPrice)
  - ✅ Should return empty array for no matching results
  - ✅ Should combine multiple filters (make + category)
  - ✅ Should return 401 Unauthorized without token
- `PUT /api/vehicles/:id` (Admin Only)
  - ✅ Should update a vehicle as admin
  - ✅ Should update multiple fields at once
  - ✅ Should return 403 Forbidden when regular user tries to update
  - ✅ Should return 404 Not Found for non-existent vehicle ID
  - ✅ Should return 401 Unauthorized without token
- `DELETE /api/vehicles/:id` (Admin Only)
  - ✅ Should delete a vehicle as admin
  - ✅ Vehicle should no longer exist after deletion
  - ✅ Should return 403 Forbidden when regular user tries to delete
  - ✅ Should return 404 Not Found for non-existent vehicle ID
  - ✅ Should return 401 Unauthorized without token

### 3. Inventory Operations Suite (`tests/inventory.test.js` – 28 Tests)
- `POST /api/vehicles/:id/purchase`
  - ✅ Should purchase a vehicle and decrease quantity by 1
  - ✅ Quantity in DB should be decremented after purchase
  - ✅ Should allow admin to purchase a vehicle
  - ✅ Should allow multiple purchases until stock reaches 0
  - ✅ Should return 400 Bad Request when vehicle is out of stock
  - ✅ Should prevent purchase when quantity is already 0
  - ✅ Should return 404 Not Found for non-existent vehicle ID
  - ✅ Should return 401 Unauthorized without token
- `POST /api/vehicles/:id/restock` (Admin Only)
  - ✅ Should restock a vehicle as admin
  - ✅ Quantity in DB should be incremented after restock
  - ✅ Should restock a vehicle that was out of stock
  - ✅ Should return 403 Forbidden when regular user tries to restock
  - ✅ Should return 400 Bad Request for zero quantity
  - ✅ Should return 400 Bad Request for negative quantity
  - ✅ Should return 400 Bad Request when quantity is missing
  - ✅ Should return 404 Not Found for non-existent vehicle ID
  - ✅ Should return 401 Unauthorized without token

---

## 🛠️ Test Environment & Isolation Setup

To prevent test interference and guarantee 100% test repeatability:

1. **Dedicated Test Database**: Tests run against `incubyte_car_dealership_test`.
2. **Automated Schema Synchronization**: `tests/globalSetup.js` automatically creates the test database and executes `npx prisma db push --force-reset` before running tests.
3. **Database Cleardown**: `beforeEach` and `afterAll` hooks clean up test records in PostgreSQL.

---

## 🚀 How to Run Tests

```bash
cd backend

# Run all test suites
npm test

# Run tests with HTML coverage report
npm run test:coverage
```
