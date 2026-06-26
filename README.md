# Membership Manager

Monorepo for the **Membership Manager** school project — a generic membership management
system (gyms, clubs, libraries, etc.) with an admin dashboard and member portal.

| Folder | Purpose |
| ------ | ------- |
| [`server/`](server/) | Laravel 13 REST API (MySQL, Sanctum auth) |
| [`client/`](client/) | React + Vite + MUI (Modernize dashboard template) |

---

## Architecture

```
┌─────────────────────┐     Bearer token      ┌─────────────────────┐
│  client/            │  ──────────────────►  │  server/            │
│  React @ :5173      │     JSON /api/*       │  Laravel @ :8000    │
└─────────────────────┘                       └──────────┬──────────┘
                                                       │
                                                       ▼
                                            ┌─────────────────────┐
                                            │  MySQL (Docker)     │
                                            │  :3306              │
                                            └─────────────────────┘
```

- **Admin** — manage plans, members, payments, check-ins, view dashboard stats
- **Member** — view subscription, payment history, self check-in

---

## Prerequisites

| Tool | Used for | Install |
| ---- | -------- | ------- |
| **Docker Desktop** | MySQL database | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **PHP 8.4+** + **Composer** | Laravel API | [php.new](https://php.new) — details in [server/README.md](server/README.md) |
| **Node.js** (LTS) | React client | [nodejs.org](https://nodejs.org/) |

---

## Quick start (first time)

Run these steps once after cloning the repo.

### 1. Start MySQL

From this folder (`membership-manager`):

```bash
docker compose up -d
docker compose ps    # mysql should be "healthy"
```

### 2. Set up the API server

```bash
cd server
composer install
cp .env.example .env          # skip if .env already exists
php artisan key:generate      # skip if APP_KEY is already set
php artisan migrate:fresh --seed
php artisan serve
```

Open **http://127.0.0.1:8000** — Laravel welcome page.

Full API setup, troubleshooting, and **API reference**:
**[server/README.md](server/README.md)**

### 3. Set up the React client

Open a **second terminal**:

```bash
cd client
npm install
cp .env.example .env          # skip if .env already exists
npm run dev
```

Open **http://localhost:5173** — login page.

Full client setup and UI workflow:
**[client/README.md](client/README.md)**

### 4. Log in

Use seeded accounts (password for all: `password`):

| Role | Email |
| ---- | ----- |
| Admin | `admin@example.com` |
| Member | `alice@example.com` |

---

## Daily development

Three things need to be running:

| Step | Where | Command |
| ---- | ----- | ------- |
| 1. MySQL | repo root | `docker compose up -d` |
| 2. API | `server/` | `php artisan serve` |
| 3. Client | `client/` | `npm run dev` |

| Service | URL |
| ------- | --- |
| React app | http://localhost:5173 |
| Laravel API | http://127.0.0.1:8000 |
| API routes | http://127.0.0.1:8000/api/... |

Stop MySQL when done: `docker compose down` (from repo root).

---

## Project structure

```
membership-manager/
├── docker-compose.yml       # MySQL 8.4
├── docker/mysql/init.sql
├── README.md                # this file
├── server/
│   ├── app/                 # Controllers, Models
│   ├── routes/api.php       # API routes
│   ├── database/            # Migrations, seeders
│   ├── docs/database.md     # DB reset, inspect tables
│   ├── backend-prompts.md   # How the API was built
│   └── README.md            # Server setup + API reference
└── client/
    ├── src/                 # React app (edit this)
    ├── complete-project/    # Full Modernize template (copy-only reference)
    ├── frontend-prompts.md  # How the UI is built
    └── README.md            # Client setup
```

---

## Documentation

| Doc | Description |
| --- | ----------- |
| [server/README.md](server/README.md) | PHP/Laravel setup, **all API endpoints**, test accounts |
| [server/docs/database.md](server/docs/database.md) | Database connection, reset, SQL examples |
| [client/README.md](client/README.md) | Node/React setup, dev workflow, copy UI from template |
| [server/backend-prompts.md](server/backend-prompts.md) | Backend build prompts (completed) |
| [client/frontend-prompts.md](client/frontend-prompts.md) | Frontend build prompts (in progress) |

---

## Common tasks

### Reset database + test data

From `server/`:

```bash
php artisan migrate:fresh --seed
```

### Rebuild client for production

From `client/`:

```bash
npm run build
```

### List API routes

From `server/`:

```bash
php artisan route:list --path=api
```

---

## For new teammates

1. Install **Docker**, **PHP** ([php.new](https://php.new)), and **Node.js**
2. Follow **Quick start** above (MySQL → server → client)
3. Read **API reference** in [server/README.md](server/README.md) before building UI features
4. Use [client/frontend-prompts.md](client/frontend-prompts.md) for frontend work — copy components
   from `client/complete-project/` when needed (do not edit that folder)
