# Frontend

A Vue 3 + TypeScript single-page application (SPA) built with Vite, Pinia, Vuetify, and Axios.  
It connects to the secure NestJS backend for authentication, task management, and audit logging.

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- pnpm (recommended)
- Docker (optional, for running backend locally)

### Installation & Development

```bash
cd apps/frontend
pnpm install
pnpm dev
````

Frontend will run at: [http://localhost:5173](http://localhost:5173)

---

## 🔧 Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit the backend URL:

```
VITE_SERVER_URL=http://localhost:3000
```

---

## 🧪 Testing

* E2E: Cypress

```bash
pnpm test:e2e       # Headless mode
pnpm test:e2e:dev   # Dev mode with Cypress UI
```

---

## 🧹 Lint & Format

```bash
pnpm lint       # Runs ESLint + OX Lint
pnpm format     # Prettier formatting
```

---

## 📦 Scripts

| Command             | Description              |
| ------------------- | ------------------------ |
| `pnpm dev`          | Start local dev server   |
| `pnpm build`        | Build for production     |
| `pnpm preview`      | Preview production build |
| `pnpm test:e2e`     | Run E2E tests (Cypress)  |
| `pnpm test:e2e:dev` | Dev server + Cypress UI  |
| `pnpm lint`         | Lint codebase            |
| `pnpm format`       | Format codebase          |

---

## 📄 License

MIT — See [LICENSE](../../LICENSE)
