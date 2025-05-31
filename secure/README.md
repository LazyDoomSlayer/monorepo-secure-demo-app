# Monorepo Secure DemoApp

A full-stack, secure application structured as a Turborepo monorepo.  
Leverages modern tools—`pnpm`, `TypeScript`, and `Docker`—for scalable, modular development with a focus on performance and security.

---

## 🧱 Project Structure

```
monorepo-secure-demo-app/
├── apps/                   # Application entry points (e.g., frontend, backend)
├── packages/               # Shared libraries, utilities, and configs
├── pnpm-workspace.yaml     # pnpm workspaces definition
├── turbo.json              # Turborepo configuration
└── package.json            # Root dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: https://nodejs.org/  
- **pnpm** (preferred package manager):  
  ```bash
  npm install -g pnpm
  ```
- **Docker**: https://www.docker.com/
- **Turborepo** (installed via project scripts)

### Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/your-org/monorepo-secure-demo-app.git
cd monorepo-secure-demo-app/secure
pnpm install
```

### Development

Start all development servers:

```bash
pnpm dev
```

> Under the hood, this runs `turbo run dev` across every workspace.

---

## 📦 Available Scripts

| Command          | Description                             |
| :--------------- | :---------------------------------------|
| `pnpm dev`       | Launch all apps in development mode      |
| `pnpm build`     | Build every project for production       |
| `pnpm lint`      | Run linters across all workspaces        |
| `pnpm format`    | Apply code formatting (Prettier, etc.)   |

---

## 📁 Workspaces

Defined in **pnpm-workspace.yaml**:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Each folder under `apps/` or `packages/` is treated as an isolated workspace.

---

## 🛠 Turborepo Configuration

Located in **turbo.json**:
- **dev**: Persistent watch mode for local servers
- **build**: Runs builds in dependency order (`^build`)
- **lint**, **format**: Stateless tasks with no cached outputs

---

## 🔐 Security Highlights

- **Authentication & Refresh Tokens**: Secure JWT flows
- **Encrypted Data Storage**: PostgreSQL managed within Docker
- **Separation of Concerns**: Clean frontend/backend boundaries

---