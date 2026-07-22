# AutoInventory – Car Dealership Inventory System

A full-stack Car Dealership Inventory Management System built with modern technologies following professional software engineering practices.

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript (Node.js ES6 / CommonJS)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Validation**: Zod
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18
- **Language**: JavaScript (JSX)
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
│   │   ├── types/          # AppError class
│   │   ├── validators/     # Zod schemas
│   │   ├── app.js
│   │   └── server.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── vehicle.test.js
│   │   ├── inventory.test.js
│   │   └── globalSetup.js
│   ├── .env.example
│   ├── jest.config.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios API clients
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Login, Register, Dashboard, Admin
│   │   ├── App.jsx
│   │   └── main.jsx
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

**Test Results:** 66 tests across 3 suites — all passing (100% Pass Rate, **94.89% Statement Coverage**) ✅

| Suite | Tests | Stmt Coverage |
|-------|-------|---------------|
| `auth.test.js` | 16 | 100% |
| `vehicle.test.js` | 22 | 88.0% |
| `inventory.test.js` | 28 | 100% |

For full test inventory, code coverage matrix, and test isolation setup, see [TEST_REPORT.md](./TEST_REPORT.md).

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

## 📸 Application Screenshots

### 1. Showroom Dashboard
![Showroom Dashboard](./screenshots/dashboard.png)

### 2. Vehicle Specifications Modal
![Vehicle Specifications](./screenshots/vehicle_details.png)

### 3. Interactive Checkout & Booking Modal
![Interactive Checkout Modal](./screenshots/checkout_modal.png)

### 4. Booking Receipt & Tax Invoice
![Booking Receipt](./screenshots/purchase_receipt.png)

### 5. Admin Fleet Management Panel
![Admin Management Panel](./screenshots/admin_panel.png)

### 6. Admin Vehicle Edit Dialog Popup
![Admin Vehicle Edit Modal](./screenshots/admin_edit_modal.png)

---

## 🤖 My AI Usage

This project was developed with the assistance of **Antigravity (Google DeepMind)** AI coding assistant.

See [PROMPTS.md](./PROMPTS.md) for the full interaction log and AI usage description.
