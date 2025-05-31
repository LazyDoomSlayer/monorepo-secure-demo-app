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
2. **Configure environment** :  Copy `.env` from the example (if there is one) or create it at `apps/backend/.env` with:
   ```env
    CORS_ORIGINS=http://localhost:4173,http://localhost:5173,*
    DATABASE_URL=postgres://<db_user>:<db_paswword>@<ip>/<db_name>

    POSTGRES_USER=<db_user>
    POSTGRES_PASSWORD=<db_paswword>
    POSTGRES_DB=<db_name>

    JWT_SECRET=<secret_1>
    JWT_REFRESH_SECRET=<secret_2>

    ADMIN_USERNAME=<username>
    ADMIN_PASSWORD=<password>
   ```

3. **Start PostgreSQL**:  This spins up a `postgres:15` container configured via `docker-compose.yml`.
   ```bash
   docker-compose up -d
   ```

4. **Run in development**: The API will be served at http://localhost:3000 by default.
   ```bash
   pnpm dev
   ```





## 🧪 Testing
- **E2E** (Jest + Supertest, configured in `test/jest-e2e.json`):
  ```bash
  pnpm test:e2e
  ```

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


## 📄 License

This backend is licensed under **MIT**.  
See [LICENSE](../../LICENSE) at the repo root for details.