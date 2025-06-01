# Backend

<p align="center">
  <a href="https://nestjs.com/" target="_blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="NestJS Logo" /></a>
</p>

NestJS-based REST API for secure task management.  
Includes modules for authentication (JWT), audit logging, and PostgreSQL integration.

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- pnpm
- Docker & Docker Compose (for PostgreSQL)

---

### Setup

```bash
cd apps/backend
pnpm install
````

---

### Environment Setup

Create `.env` manually or copy:

```bash
cp .env.example .env
```

Customize it with your DB and secrets:

```env
CORS_ORIGINS=http://localhost:5173,*
DATABASE_URL=postgres://user:pass@localhost:5432/db_name

POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=db_name

JWT_SECRET=secret
JWT_REFRESH_SECRET=refresh_secret

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

---

### Start Services

```bash
docker-compose up -d        # Start PostgreSQL
pnpm dev                    # Start NestJS API at http://localhost:3000
```

---

## 🧪 Testing

* E2E: Jest + Supertest

```bash
pnpm test:e2e
```

---

## 📦 Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `pnpm dev`        | Start dev server with hot reload |
| `pnpm build`      | Compile TypeScript to `dist/`    |
| `pnpm start:prod` | Run compiled code                |
| `pnpm lint`       | Lint source and tests            |
| `pnpm format`     | Format code with Prettier        |
| `pnpm test`       | Run unit and integration tests   |
| `pnpm test:watch` | Run tests in watch mode          |
| `pnpm test:cov`   | Generate coverage report         |
| `pnpm test:e2e`   | Run end-to-end tests             |

---

## 📄 License

MIT — See [LICENSE](../../LICENSE)
