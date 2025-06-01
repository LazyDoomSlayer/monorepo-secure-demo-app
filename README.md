# Monorepo Secure Demo App

This monorepo contains two nearly identical projects:

- `secure/`: Application **with** security features enabled.
- `unsecure/`: Application **without** security features (for testing/demo purposes).

Each project has the same structure:
- `apps/backend`: NestJS API
- `apps/frontend`: Vue 3 SPA with Cypress E2E tests

---

## 📦 Requirements

- Node.js 18+
- Docker & Docker Compose
- PNPM (recommended): `npm i -g pnpm`
- TurboRepo CLI (optional): `pnpm dlx turbo`

---

## 🚀 Running the Applications

### 🛡️ Secure Version

```bash
cd secure
pnpm install
pnpm run dev  # Starts both frontend and backend using Turbo
````

### ⚠️ Unsecure Version

```bash
cd unsecure
pnpm install
pnpm run dev
```

---

## 🧪 Running Tests

### ✅ Frontend - Cypress E2E Tests

From either `secure` or `unsecure`:

```bash
cd apps/frontend
pnpm cypress open     # For interactive mode
pnpm cypress run      # For headless CI run
```

### 🔁 Backend - Integration Tests

```bash
cd apps/backend
pnpm test             # Run all unit and integration tests
pnpm test:watch       # Watch mode
```

---

## 🐳 Running with Docker (Optional)

Use Docker if you don’t want to run everything locally.

### 🛠️ Build and Start Containers

From either `secure` or `unsecure`:

```bash
docker compose up -d --build
```

Make sure `docker-compose.yml` exists and maps:

* Backend to a Node.js container with PostgreSQL
* Frontend to a Vite/Nginx container

### 🧼 Stop and Clean

```bash
docker-compose down
```

---

## 📁 Project Structure Overview

```
apps/
  ├── backend/   # NestJS backend with modules like auth, tasks, audit
  └── frontend/  # Vue 3 app with Cypress tests and Pinia store
```

---

## 🧩 Notes

* Both projects use TurboRepo for managing tasks.
* Secure version has modules like `auth`, `audit`, and `logging` with additional guards and strategies.
* Cypress specs live in `apps/frontend/cypress/e2e/`
* Integration tests are inside `apps/backend/test/`

---

## 🧑‍💻 Author

LazyDoomSlayer · [GitHub](https://github.com/LazyDoomSlayer)


