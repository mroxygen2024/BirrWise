

# BirrWise

A full-stack personal finance management application with AI-powered chat, budgeting, and transaction tracking.

---

## Features

- User registration, login, logout, and JWT-based authentication
- Budget management (list, update)
- Transaction management (list, create, update, delete)
- Dashboard analytics (summary, category expenses, monthly, daily)
- AI-powered chat assistant (if enabled)
- Responsive, modern UI (React, Tailwind CSS, Radix UI)
- Mock data for development (frontend only)

## Tech Stack

**Frontend:**
- React 18, TypeScript, Vite, Tailwind CSS, Radix UI, React Router DOM, React Hook Form, TanStack React Query, Recharts, Vitest

**Backend:**
- Node.js, Express, TypeScript, Mongoose (MongoDB), Zod (validation), JWT, Helmet, CORS, Morgan, dotenv

**Database:**
- MongoDB (via Mongoose)

**Other Tools:**
- Bun (optional for frontend), ESLint

## Architecture

- The frontend (client/) communicates with the backend (server/) via RESTful HTTP requests.
- The backend exposes endpoints under `/api/` for authentication, budgets, transactions, dashboard, and AI chat.
- JWT-based authentication is enforced for protected routes.
- MongoDB is used for persistent storage of users, transactions, budgets, and AI chat history.

## Installation

### 1. Clone the repository
```bash
git clone <repo-url>
cd AI-Powered-personal-finance
```

### 2. Setup Server
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
```

### 3. Setup Client
```bash
cd ../client
bun install # or npm install
cp .env .env # (edit VITE_API_BASE_URL if needed)
```

### 4. Environment Variables

#### Backend (`server/.env.example`)
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/savvy_finance
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=1h
JWT_ISSUER=savvy-finance-hub
JWT_AUDIENCE=savvy-finance-hub-client
REFRESH_TOKEN_SECRET=replace_with_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8080
AI_ENABLED=false
GOOGLE_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

#### Frontend (`client/.env`)
```
VITE_API_BASE_URL=http://localhost:4000/api
```

## Running the Project

### Development

#### Backend
```bash
cd server
npm run dev
```

#### Frontend
```bash
cd client
bun run dev # or npm run dev
```

### Production
- Build frontend: `bun run build` or `npm run build`
- Start backend: `npm run start` (after building with `npm run build`)

---

## API Documentation

### Auth Routes (`/api/auth`)
- `POST   /login` — Login
- `POST   /register` — Register
- `POST   /refresh` — Refresh JWT
- `POST   /logout` — Logout
- `GET    /me` — Get current user (JWT required)

### Budget Routes (`/api/budgets`)
- `GET    /` — List budgets (with validation)
- `PUT    /:id` — Update budget (with validation)

### Transaction Routes (`/api/transactions`)
- `GET    /` — List transactions
- `POST   /` — Create transaction (with validation)
- `PUT    /:id` — Update transaction (with validation)
- `DELETE /:id` — Delete transaction (with validation)

### Dashboard Routes (`/api/dashboard`)
- `GET /summary`
- `GET /category-expenses`
- `GET /monthly`
- `GET /daily-expenses`

### AI Routes (`/api/ai`)
- `POST /chat` — AI chat assistant (with validation, requires AI_ENABLED and GOOGLE_API_KEY)

---

## Authentication Flow

- JWT tokens are issued on login/registration.
- Protected routes require `Authorization: Bearer <token>`.
- Token validation is handled by `requireAuth` middleware.
- Refresh tokens are supported (see backend config).

---

## Payment Flow

This feature is not implemented in the current codebase.

---

## Folder Structure Overview

```
client/
  src/
    components/
    pages/
    services/
    store/
    ...
server/
  src/
    controllers/
    middleware/
    models/
    routes/
    services/
    ...
```

---

## Available Scripts

### Client
- `dev` — Start Vite dev server
- `build` — Build for production
- `build:dev` — Build in development mode
- `lint` — Run ESLint
- `preview` — Preview production build
- `test` — Run tests (Vitest)
- `test:watch` — Watch tests

### Server
- `dev` — Start backend in dev mode (ts-node-dev)
- `seed` — Seed demo user
- `build` — Compile TypeScript
- `start` — Start compiled server

---

## Deployment Notes

- No Docker or production deployment scripts/configs are present.
- Set environment variables appropriately for production.
- Serve frontend separately or via a static file host.

---


## License

MIT
