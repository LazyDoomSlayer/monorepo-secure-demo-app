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

```bash
cd apps/frontend
pnpm install

# Start the dev server (HMR + Vite)
pnpm dev
```

The app will be available at <http://localhost:5173> by default.

---

## 🔧 Configuration

Copy and adjust environment variables:

```bash
cp .env.example .env
```

- `VITE_SERVER_URL` — URL (and port) where your backend is running (e.g. `localhost:3000`).

---

## 📁 Project Structure

```
apps/frontend/
├── public/                 # Static assets (favicons, robots.txt)
├── src/
│   ├── composables/        # Reusable Vue 3 composables
│   ├── middleware/         # Route guards and auth middleware
│   ├── modules/            # API layers (auth, tasks, interceptors)
│   ├── plugins/            # Third-party integrations (Vuetify, etc.)
│   ├── router/             # Vue Router setup
│   ├── stores/             # Pinia state management
│   ├── types/              # TypeScript types & interfaces
│   ├── utils/              # Utility functions & validators
│   └── views/              # Vue views & layouts
├── cypress/                # End-to-end tests
├── vitest.config.ts        # Unit test config (Vitest)
├── vite.config.ts          # Vite build/dev config
└── package.json            # Frontend scripts & dependencies
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

## 🧪 Testing

- **Unit**: Vitest + Vue Test Utils
  ```bash
  pnpm test:unit
  ```
- **E2E**: Cypress
  ```bash
  pnpm test:e2e
  ```

---

## 🛠 Tech Stack

- **Framework:** Vue 3
- **Build Tool:** Vite
- **State:** Pinia
- **UI Library:** Vuetify
- **HTTP:** Axios + interceptors
- **Auth:** JWT + refresh-token flow
- **Language:** TypeScript
- **Styling:** CSS Modules / SASS (configure in Vite)

---

## 🎨 Lint & Format

- **ESLint** with TypeScript & Prettier rules
- **Prettier** for code formatting
- **OX Lint** for extra correctness checks

```bash
pnpm lint
pnpm format
```