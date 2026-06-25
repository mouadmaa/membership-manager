# Membership Manager

Monorepo for the **Membership Manager** school project — a generic membership management system (gyms, clubs, libraries, etc.).

| Folder | Purpose |
|--------|---------|
| [`server/`](server/) | Laravel REST API backend |
| [`client/`](client/) | React frontend (to be added) |

## Quick start

### 1. Prerequisites

- **Docker Desktop** — for MySQL only
- **PHP 8.4+** and **Composer** — install via [php.new](https://php.new) (see [server/README.md](server/README.md))
- **Node.js** — only needed when working on the React client

### 2. Start MySQL

From this folder (`membership-manager`):

```bash
docker compose up -d
```

### 3. Start the API server

```bash
cd server
composer install
cp .env.example .env   # skip if .env already exists
php artisan key:generate   # skip if APP_KEY is already set
php artisan migrate:fresh --seed
php artisan serve
```

Open **http://127.0.0.1:8000** — you should see the Laravel welcome page.

Full setup: **[server/README.md](server/README.md)** · Database reset & SQL commands: **[server/docs/database.md](server/docs/database.md)**

## Project docs

- Backend build prompts: [server/backend-prompts.md](server/backend-prompts.md)
- Frontend prompts: [client/frontend-prompts.md](client/frontend-prompts.md)
- Database guide: [server/docs/database.md](server/docs/database.md)
