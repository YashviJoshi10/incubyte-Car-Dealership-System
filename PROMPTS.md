# PROMPTS.md – AI Interaction Log

This file documents the prompts and interactions used during the development of the Car Dealership Inventory System with the assistance of the Antigravity (Google DeepMind) AI coding assistant.

---

## Session Overview

**AI Assistant**: Antigravity  
**Project**: Car Dealership Inventory System  
**Date**: July 2026  

---

## Prompt 1 – Initial Project Request

**User:**
> [Full specification document provided – see initial USER_REQUEST with tech stack, functional requirements, code quality guidelines, TDD requirements, Git workflow, documentation, and deployment requirements]

**AI Response:**
- Created a detailed implementation plan with 6 phases
- Asked clarifying questions about PostgreSQL setup, test database isolation, and dark/light mode preference

---

## Prompt 2 – Configuration Decisions

**User:**
> do End-to-end  
> yes, db separate  
> cancel dark/light mode options  
> postgresql://postgres:root@localhost:5432/incubyte_car_dealership

**AI Response:**
- Confirmed end-to-end build approach
- Confirmed separate test DB (`incubyte_car_dealership_test`)
- Received DATABASE_URL for local PostgreSQL
- Began executing the implementation plan

---

## Prompt 3 – Stack Migration Request

**User:**
> change typescript to javascript

**AI Response:**
- Formulated migration plan to convert full codebase (Backend + Frontend) from TypeScript to JavaScript.
- Converted 26 backend files to CommonJS JavaScript (`.js`), removed `@types/*`, `ts-node`, `ts-jest`, and `typescript`.
- Converted 16 frontend files to React JSX (`.jsx` / `.js`), updated Vite configuration and HTML entry.
- Retained 100% of functional requirements, Zod validations, Prisma integration, and 66 Jest unit/integration tests.
- Verified test suite and Vite production build.

---

## AI Interactions During Development

### Architecture Design
The AI proposed the following clean architecture layers:
1. **Route** → receives HTTP request
2. **Middleware** (auth, validate) → guard and validate
3. **Controller** → extract data, call service
4. **Service** → business logic, throw AppError
5. **Repository** → Prisma data access

### TDD Test Writing
All 66 tests were written before implementation:
- `auth.test.js` – 16 tests for registration, login, JWT validation
- `vehicle.test.js` – 22 tests for CRUD, search, authorization
- `inventory.test.js` – 28 tests for purchase/restock flows

### Key Design Decisions Made by AI
1. **Zod schema wrapping** in `{ body, query, params }` – allows a single reusable `validate()` middleware
2. **Singleton PrismaClient** with `globalThis` cache – prevents connection pool exhaustion in dev hot-reload
3. **`--force-reset` in globalSetup** – ensures a clean schema state before every test run
4. **Optimistic UI updates** on purchase/restock – updates state locally before server confirms, with rollback on error

### Frontend Component Design
AI designed a component hierarchy:
- `AuthContext` – auth state, login/register/logout
- `ProtectedRoute` – wraps `<Outlet>` with auth/role guards
- `Navbar` – sticky header with user info and admin link
- `VehicleCard` – card with stock indicator and action buttons
- `SearchBar` – debounced search with collapsible filter panel
- `VehicleForm` – shared form for create and edit
- `Dashboard` – vehicle grid + modals for edit/restock
- `AdminDashboard` – data table + inline forms

---

## My AI Usage Section

### What AI Did
- **90% of code generation & stack refactoring** – Most of JavaScript source and test files were generated/refactored by the AI assistant
- **Architecture planning** – Proposed and documented the full system design
- **TDD approach** – Wrote failing tests first, then implementation to pass them
- **Error handling design** – Designed centralized error handling covering all error types
- **UI/UX design** – Designed the Tailwind CSS design system and React components
- **Documentation** – Generated README, API docs, deployment guide, and PROMPTS.md

### What I Did
- **Requirements specification** – Provided the detailed project specification
- **Environment setup** – Provided PostgreSQL credentials and ran commands
- **Architectural approval** – Reviewed and approved the implementation plan & stack
- **Authentication Module** – Developed authentication module
- **Decision making** – Made build preference choices (end-to-end, separate test DB, JS migration)
- **Code review** – Reviewed generated code for correctness and quality

### Tools Used
- Antigravity AI – Primary coding assistant
- PostgreSQL – Local database for development and testing
- Git/GitHub – Version control and code hosting
