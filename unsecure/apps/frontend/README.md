# Frontend

A Vue 3 + TypeScript single-page application built with Vite, Pinia, Vuetify, and Axios.  
This app connects to the secure backend (e.g. via `VITE_SERVER_URL`) and provides authentication, task management, and responsive UI.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (≥14)
- **pnpm**  
  ```bash
  npm install -g pnpm
  ```
- **Docker** (optional, to run the backend locally)

### Install & Run
The app will be available at <http://localhost:5173> by default.pnpm

```bash
cd apps/frontend
pnpm install

pnpm dev
```

---

## 🔧 Configuration

Copy and adjust environment variables:

```bash
cp .env.example .env
```

- `VITE_SERVER_URL` — URL (and port) where your backend is running (e.g. `localhost:3000`).

---




## 🧪 Testing
- **E2E**: Cypress
  ```bash
  pnpm test:e2e
  ```
---



## 🎨 Lint & Format

- **ESLint** with TypeScript & Prettier rules
- **Prettier** for code formatting
- **OX Lint** for extra correctness checks

```bash
pnpm lint
pnpm format
```

---

## 📦 Available Scripts

| Script               | What it does                                          |
| :------------------- | :----------------------------------------------------- |
| `pnpm dev`           | Start Vite dev server (hot reload)                    |
| `pnpm build`         | Run type-check & build for production                 |
| `pnpm preview`       | Preview the production build via `vite preview`       |
| `pnpm test:unit`     | Run unit tests with Vitest                            |
| `pnpm test:e2e`      | Build, serve and run Cypress E2E tests (headless)     |
| `pnpm test:e2e:dev`  | Start dev server & open Cypress UI                    |
| `pnpm lint`          | Run ESLint (auto-fix) and OX Lint                      |
| `pnpm format`        | Format `src/` files with Prettier                      |

---

## 📄 License

This backend is licensed under **MIT**.  
See [LICENSE](../../LICENSE) at the repo root for details.