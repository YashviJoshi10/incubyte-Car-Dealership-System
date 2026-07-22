# AutoInventory – Car Dealership Inventory System

A full-stack Car Dealership Inventory Management System built with modern technologies following professional software engineering practices.

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Validation**: Zod
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v6
- **HTTP Client**: Axios

---

## 📁 Project Structure

```
incubyte/
├── backend/
│   ├── src/
│   │   ├── config/         # DB and env config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, error, validate
│   │   ├── repositories/   # Data access layer (Prisma)
│   │   ├── routes/         # Express routers
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── validators/     # Zod schemas
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── tests/
│   │   ├── auth.test.ts
│   │   ├── vehicle.test.ts
│   │   ├── inventory.test.ts
│   │   └── globalSetup.ts
│   ├── .env.example
│   ├── jest.config.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios API clients
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Login, Register, Dashboard, Admin
│   │   ├── types/          # Shared TS types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
├── README.md
├── PROMPTS.md
└── .gitignore
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repository
```bash
git clone https://github.com/YashviJoshi10/incubyte-Car-Dealership-System.git
cd incubyte-Car-Dealership-System
```

### 2. Backend Setup
```bash
cd backend

# Copy environment file
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Install dependencies
npm install

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**  
The API runs on **http://localhost:3000**

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/incubyte_car_dealership"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:3000/api
```

---

## 🧪 Running Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

**Test Results:** 66 tests across 3 suites — all passing ✅

| Suite | Tests |
|-------|-------|
| auth.test.ts | 16 |
| vehicle.test.ts | 22 |
| inventory.test.ts | 28 |

Tests use a separate `incubyte_car_dealership_test` database that is auto-created and schema-synced on each test run.

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/api/auth/register` | No | — |
| POST | `/api/auth/login` | No | — |
| GET | `/api/vehicles` | Yes | Any |
| GET | `/api/vehicles/search` | Yes | Any |
| POST | `/api/vehicles` | Yes | Admin |
| PUT | `/api/vehicles/:id` | Yes | Admin |
| DELETE | `/api/vehicles/:id` | Yes | Admin |
| POST | `/api/vehicles/:id/purchase` | Yes | Any |
| POST | `/api/vehicles/:id/restock` | Yes | Admin |

For full API documentation, see [API_DOCS.md](./API_DOCS.md).

---

## 📱 Features

### Authentication
- JWT-based authentication (24h expiry)
- Password hashing with bcrypt (10 rounds)
- Role-based access control (Admin / User)

### Vehicle Management
- CRUD operations (Admin only for write)
- Case-insensitive search by make, model, category
- Price range filtering (minPrice, maxPrice)

### Inventory
- Purchase: decrements quantity, blocks when out-of-stock
- Restock: Admin-only, adds specified quantity

### Frontend
- Login and Register pages
- Dashboard with vehicle cards, search bar, filters
- Real-time purchase with quantity updates
- Admin Panel with data table, add/edit/delete/restock
- Toast notifications
- Responsive design

---

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment instructions.

---

## 📸 Screenshots

| Screen | Preview |
|--------|---------|
| Login | _[See live demo]_ |
| Dashboard | _[See live demo]_ |
| Admin Panel | _[See live demo]_ |

---

## 🤖 My AI Usage

This project was developed with the assistance of **Antigravity (Google DeepMind)** AI coding assistant.

See [PROMPTS.md](./PROMPTS.md) for the full interaction log and AI usage description.

### How AI Assisted This Project
1. **Architecture Design** – AI proposed the layered architecture (Repository → Service → Controller) and database schema
2. **TDD Test Writing** – All 66 tests were written by AI first (failing), then implementation followed
3. **Code Generation** – AI generated all TypeScript source files following SOLID principles
4. **Error Handling** – AI designed centralized error middleware covering Zod, AppError, and Prisma errors
5. **Frontend Design** – AI designed the UI component system with Tailwind CSS
6. **Documentation** – AI generated README, API docs, deployment guide, and PROMPTS.md

Human contributions: Requirements specification, database credentials, architectural approval, and code review.
