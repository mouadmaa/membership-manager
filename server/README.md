# Membership Manager — API Server

Laravel REST API for the Membership Manager project. Manages users, members, plans, subscriptions, payments, and check-ins.

**Stack:** PHP 8.4+ (local via [php.new](https://php.new)) · Laravel 13 · MySQL 8.4 (Docker) · Laravel Sanctum (token auth)

**Docs:** [Database guide](docs/database.md) — connect, reset, seed, inspect tables

---

## Prerequisites

Install these once on your machine:

| Tool | Purpose | Install |
|------|---------|---------|
| **Docker Desktop** | Runs MySQL only | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **PHP 8.4+** | Runs Laravel | [php.new](https://php.new) — see below |
| **Composer** | PHP dependencies | Included with php.new, or `composer self-update` |
| **Node.js** | Frontend assets (optional for API-only work) | [nodejs.org](https://nodejs.org/) |

### Install PHP with php.new (recommended)

php.new installs PHP and Composer without XAMPP.

**Windows (PowerShell — run as normal user):**

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))
```

**macOS:**

```bash
/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.4)"
```

**Linux:**

```bash
/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.4)"
```

Close and reopen your terminal, then verify:

```bash
php --version    # should show 8.4.x or newer
composer --version
```

**Git Bash on Windows:** php.new installs to `~/.config/herd-lite/bin`. If `composer` is not found in Git Bash:

```bash
export PATH="$HOME/.config/herd-lite/bin:$PATH"
```

Or use **PowerShell** — both `php` and `composer` work there after php.new install.

> **PHP version note:** herd-lite may ship PHP 8.4.0. If `composer install` fails with Symfony requiring PHP `>= 8.4.1`, run `composer update` once from `server/`.

---

## First-time setup (new clone)

All commands below assume you are in the **`server/`** folder unless noted.

### 1. Start MySQL (from repo root)

```bash
cd ..                  # membership-manager root
docker compose up -d
docker compose ps      # mysql should be "healthy"
```

### 2. Install PHP dependencies

```bash
cd server
composer install
```

### 3. Environment file

```bash
cp .env.example .env
php artisan key:generate
```

Database settings are in `.env.example` — see [Database guide](docs/database.md#connection-settings).

### 4. Run migrations and seed test data

```bash
php artisan migrate:fresh --seed
```

Or migrations only (empty tables): `php artisan migrate`

### 5. Start the development server

```bash
php artisan serve
```

Open **http://127.0.0.1:8000** — Laravel welcome page.

---

## Daily development

From **`membership-manager`** root:

```bash
docker compose up -d
```

From **`server/`**:

```bash
php artisan serve
```

Stop MySQL: `docker compose down` (from repo root)

---

## Common commands

Run from **`server/`**:

| Command | What it does |
|---------|----------------|
| `php artisan serve` | Start API at http://127.0.0.1:8000 |
| `php artisan migrate` | Run new migrations |
| `php artisan migrate:fresh --seed` | Reset DB + test data — [details](docs/database.md#reset-database-and-load-test-data) |
| `php artisan route:list` | List all API routes |
| `composer install` | Install PHP packages after pull |

Database commands, SQL examples, and troubleshooting: **[docs/database.md](docs/database.md)**

---

## API base URL

- **Web / welcome:** `http://127.0.0.1:8000`
- **API routes:** `http://127.0.0.1:8000/api/...`
- **Postman:** base URL `http://127.0.0.1:8000`

React client (later): `http://localhost:5173`

---

## Troubleshooting

### `php` or `composer` not found

- Re-run php.new installer; close and reopen terminal
- On Windows, prefer **PowerShell** or add herd-lite to PATH in Git Bash

### Port 8000 already in use

```bash
php artisan serve --port=8001
```

Update `APP_URL` in `.env` if needed.

### Database issues

See **[docs/database.md](docs/database.md#troubleshooting)**.

---

## Project structure (server)

```
server/
├── app/Http/Controllers/
├── app/Models/
├── database/migrations/
├── database/seeders/
├── docs/
│   └── database.md         # DB connection, reset, inspect tables
├── routes/api.php
└── config/
```

---

## Teammate checklist

- [ ] Docker Desktop installed and running
- [ ] PHP 8.4+ and Composer via php.new
- [ ] Repo cloned
- [ ] `docker compose up -d` from repo root
- [ ] `composer install` in `server/`
- [ ] `.env` from `.env.example`, `php artisan key:generate`
- [ ] `php artisan migrate:fresh --seed`
- [ ] `php artisan serve` → http://127.0.0.1:8000 works
