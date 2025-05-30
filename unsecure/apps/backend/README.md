# Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

A NestJS-based REST API for task management, with JWT auth and PostgreSQL—packaged as part of the Turborepo monorepo.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (≥16)
- **pnpm**
  ```bash
  npm install -g pnpm
  ```
- **Docker & Docker Compose** (for PostgreSQL)

### Setup

1. **Install dependencies**
   ```bash
   cd apps/backend
   pnpm install
   ```
2. **Configure environment**  
   Copy `.env` from the example (if there is one) or create it at `apps/backend/.env` with:

   ```env
   POSTGRES_USER=secure_user
   POSTGRES_PASSWORD=super_secure_password_123
   POSTGRES_DB=nest_task_management_db

   JWT_SECRET=my-super-secret-access-key
   JWT_REFRESH_SECRET=my-even-more-secret-refresh-key-123456789
   ```

3. **Start PostgreSQL**
   ```bash
   docker-compose up -d
   ```
   This spins up a `postgres:15` container configured via `docker-compose.yml`.

4. **Run in development**
   ```bash
   pnpm dev
   ```
   Under the hood, this runs:
   ```
   nest start --watch
   ```
   The API will be served at http://localhost:3000 by default.

---

## 📁 Project Structure

```
apps/backend/
├── src/
│   ├── auth/                # Authentication module (controllers, services, guards)
│   ├── tasks/               # Task module (controllers, services, DTOs)
│   ├── assets/              # Static assets (if any)
│   └── main.ts              # Application entrypoint
├── test/                    # Jest unit & e2e tests
│   ├── jest-e2e.json        # E2E config
│   └── HelloWorld.spec.ts   # Example test
├── .env                     # Environment variables
├── docker-compose.yml       # PostgreSQL service
├── nest-cli.json            # Nest CLI configuration
├── tsconfig*.json           # TypeScript configs
├── eslint.config.mjs        # Lint rules
├── prettier.config.js       # (via root or inherited)
├── package.json             # Scripts & dependencies
└── README.md                # ← You are here
```

---

## 📦 Available Scripts

Run these from `apps/backend`:

| Command            | Description                                           |
| :----------------- | :---------------------------------------------------- |
| `pnpm dev`         | Start in watch mode (`nest start --watch`)            |
| `pnpm start:dev`   | Alias for `pnpm dev`                                  |
| `pnpm start:debug` | Launch with Node debugger attached                    |
| `pnpm start:prod`  | Serve compiled `dist/main.js`                         |
| `pnpm build`       | Compile TypeScript to `dist/` via `nest build`        |
| `pnpm lint`        | Run ESLint & auto-fix (`src/`, `test/`)                |
| `pnpm format`      | Format code with Prettier (`src/**/*.ts`, `test/**/*.ts`) |
| `pnpm test`        | Run Jest unit tests                                   |
| `pnpm test:watch`  | Run Jest in watch mode                                |
| `pnpm test:cov`    | Generate Jest coverage report                         |
| `pnpm test:e2e`    | Run end-to-end tests via Jest & Supertest             |

---

## 🔒 Security & Auth

- **JWT Access & Refresh Tokens**
    - Configured via `JWT_SECRET` & `JWT_REFRESH_SECRET`
    - `/auth/login`, `/auth/register`, `/auth/refresh` endpoints

- **Database Encryption**
    - All data in PostgreSQL stored on a Docker volume (encrypted at rest by default if configured)

---

## 🧪 Testing

- **Unit** (Jest + `@nestjs/testing`):
  ```bash
  pnpm test
  ```
- **E2E** (Jest + Supertest, configured in `test/jest-e2e.json`):
  ```bash
  pnpm test:e2e
  ```

---

## 📄 API Collection

Use the Postman collection for manual API testing:

```
apps/backend/app.postman_collection.json
```

Import this into Postman (or Insomnia) to explore all endpoints.

---

## 📄 License

This backend is licensed under **MIT**.  
See [LICENSE](../../LICENSE) at the repo root for details.
```