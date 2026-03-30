<p align="center">
	<img src="client/public/favicon.svg" alt="BirrWise logo" width="56" height="56" />
</p>

<h1 align="center">BirrWise</h1>

<p align="center">
	Full-stack personal finance platform for budgeting, transactions, analytics, and AI-assisted money insights.
</p>

<p align="center">
	<a href="#"><img alt="React" src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white" /></a>
	<a href="#"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" /></a>
	<a href="#"><img alt="Vite" src="https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white" /></a>
	<a href="#"><img alt="Express" src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" /></a>
	<a href="#"><img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Mongoose-47a248?logo=mongodb&logoColor=white" /></a>
	<a href="#"><img alt="AI" src="https://img.shields.io/badge/AI-Gemini-1f6feb" /></a>
	<a href="#"><img alt="Auth" src="https://img.shields.io/badge/Auth-JWT-success" /></a>
	<a href="#"><img alt="Build" src="https://img.shields.io/badge/Build-NPM%20%2F%20Bun-lightgrey" /></a>
	<a href="#"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue" /></a>
</p>

![BirrWise Mock UI](client/public/birrwise-mock.png)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Apps](#running-the-apps)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## Overview

BirrWise helps users take control of personal finances with an integrated dashboard and AI chat experience.

- Track and categorize transactions
- Set and monitor monthly budgets
- Review spending trends and summary analytics
- Ask finance questions through an AI assistant (optional via Gemini)

## Features

- Secure authentication with access and refresh token flow
- Budget management with validation and update support
- Transaction CRUD with category-aware tracking
- Dashboard analytics (summary, category, monthly, and daily insights)
- Optional AI assistant endpoint for contextual personal-finance guidance
- Clean, responsive React UI built with Tailwind + shadcn/ui + Radix components

## Tech Stack

### Frontend

- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS
- shadcn/ui + Radix UI
- React Query, React Hook Form, Recharts, Zustand

### Backend

- Node.js + Express 4
- TypeScript
- MongoDB with Mongoose
- Zod request validation
- JWT authentication

### Tooling

- ESLint
- Vitest
- Bun or npm for frontend workflow

## Architecture

- `client/` is a SPA that consumes REST APIs from `server/`.
- `server/` exposes API modules for auth, budgets, transactions, dashboard, and AI chat.
- Protected endpoints use JWT middleware.
- MongoDB stores users, transactions, budgets, refresh tokens, and AI history metadata.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+ (or Bun for client scripts)
- MongoDB instance (local or hosted)

### 1. Clone

```bash
git clone <repo-url>
cd AI-Powered-personal-finance
```

### 2. Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

## Dockerized Deployment

BirrWise supports full Docker-based development and production workflows for maximum consistency and ease of onboarding.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- MongoDB Atlas account (or any remote MongoDB URI)

### 1. Environment Setup

Copy example environment files and fill in your secrets:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

- For **development**, set `VITE_API_BASE_URL=http://localhost:4000/api` in `client/.env`.
- For **production**, set `VITE_API_BASE_URL=/api` in `client/.env` (or use a build-time override).
- Set your MongoDB Atlas URI in `server/.env` as `MONGODB_URI`.

### 2. Development (Hot Reload)

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:4000](http://localhost:4000)

### 3. Production (Optimized, Nginx)

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```
- Frontend: [http://localhost](http://localhost)
- Backend: available at `/api` via nginx reverse proxy

### 4. Stopping Containers

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
# or for production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

### 5. Best Practices & Notes
- **No local MongoDB container**: Use MongoDB Atlas for production-grade reliability.
- **Secrets**: Never commit `.env` files. Rotate any credential if exposed.
- **Alpine images & multi-stage builds**: Used for small, secure, and fast containers.
- **Networking**: Docker service names are used for internal communication (never `localhost`).
- **Frontend/Backend ports**: Dev: 5173 (client), 4000 (server). Prod: nginx serves frontend on 80, proxies `/api` to backend.
- **Troubleshooting**: If you see permission errors, run `sudo chown -R $USER:$USER .` in the project root.

### 6. MongoDB Atlas
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Whitelist your server's IP or use 0.0.0.0/0 for dev (not recommended for prod)
- Copy the connection string to `server/.env` as `MONGODB_URI`

---

## Running the Apps

> **Recommended:** Use Docker Compose as described above for a unified workflow.

Or, to run manually:

### Backend
```bash
cd server
npm run dev
```

### Frontend
```bash
cd client
npm run dev
```

---

## API Endpoints

### Auth (`/api/auth`)

- `POST /register`
- `POST /login`
- `POST /refresh`
- `POST /logout`
- `GET /me`

### Budgets (`/api/budgets`)

- `GET /`
- `PUT /:id`

### Transactions (`/api/transactions`)

- `GET /`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

### Dashboard (`/api/dashboard`)

- `GET /summary`
- `GET /category-expenses`
- `GET /monthly`
- `GET /daily-expenses`

### AI (`/api/ai`)

- `POST /chat` (requires `AI_ENABLED=true` and `GOOGLE_API_KEY`)

## Folder Structure

```text
AI-Powered-personal-finance/
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- store/
|   |   `-- utils/
|   `-- package.json
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- schemas/
|   |   |-- services/
|   |   `-- utils/
|   `-- package.json
`-- README.md
```

## Available Scripts

### Client

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run test`

### Server

- `npm run dev`
- `npm run seed`
- `npm run build`
- `npm run start`

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes with clear messages.
4. Open a pull request with context and test notes.

## License

MIT
