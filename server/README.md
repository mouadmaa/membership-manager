# Membership Manager — API Server

Laravel REST API for the Membership Manager project. Manages users, members, plans, subscriptions, payments, and check-ins.

**Stack:** PHP 8.4+ (local via [php.new](https://php.new)) · Laravel 13 · MySQL 8.4 (Docker) · Laravel Sanctum (token auth)

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

**Git Bash on Windows:** php.new installs to `~/.config/herd-lite/bin`. If `composer` is not found in Git Bash, add it to your session:

```bash
export PATH="$HOME/.config/herd-lite/bin:$PATH"
```

Or use **PowerShell** — both `php` and `composer` work there after php.new install.

> **PHP version note:** herd-lite may ship PHP 8.4.0. Laravel 13 works with it; if `composer install` fails with Symfony requiring PHP `>= 8.4.1`, run `composer update` once from `server/` (dependencies will resolve to compatible Symfony 8.0 packages). Alternatively, upgrade PHP via a newer php.new install when available.

---

## First-time setup (new clone)

All commands below assume you are in the **`server/`** folder unless noted.

### 1. Start MySQL (from repo root)

```bash
cd ..                  # membership-manager root (one level above server/)
docker compose up -d
```

Wait until MySQL is healthy:

```bash
docker compose ps
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

The default `.env.example` is already configured for this project:

| Variable | Value |
|----------|-------|
| `APP_URL` | `http://127.0.0.1:8000` |
| `DB_HOST` | `127.0.0.1` |
| `DB_PORT` | `3306` |
| `DB_DATABASE` | `membership_manager` |
| `DB_USERNAME` | `laravel` |
| `DB_PASSWORD` | `secret` |

### 4. Run migrations

```bash
php artisan migrate
```

Sanctum is already installed; the `personal_access_tokens` migration runs with the rest.

### 5. Start the development server

```bash
php artisan serve
```

Open **http://127.0.0.1:8000** — you should see the Laravel welcome page.

> **Note:** MySQL runs on port `3306` but speaks the MySQL protocol, not HTTP. Do not open `http://localhost:3306` in a browser. Use a DB client (TablePlus, DBeaver, etc.) or `php artisan db:show` to verify the database.

---

## Daily development

From **`membership-manager`** root:

```bash
docker compose up -d          # start MySQL
```

From **`server/`**:

```bash
php artisan serve             # API at http://127.0.0.1:8000
```

Stop MySQL when finished:

```bash
docker compose down           # from repo root
```

---

## Common commands

Run from **`server/`**:

| Command | What it does |
|---------|----------------|
| `php artisan migrate` | Run new migrations |
| `php artisan migrate:fresh --seed` | Wipe DB, rebuild tables, reseed test data |
| `php artisan route:list` | List all API routes |
| `php artisan db:show` | Show database connection info |
| `composer install` | Install/update PHP packages after pull |
| `composer run dev` | Start server + queue + logs + Vite (when frontend is added) |

---

## API base URL

When the server is running:

- **Web / welcome:** `http://127.0.0.1:8000`
- **API routes:** `http://127.0.0.1:8000/api/...`
- **Postman:** set base URL to `http://127.0.0.1:8000`

The React client (when added in `../client/`) will run on `http://localhost:5173`.

---

## Database (Docker)

MySQL is defined in `../docker-compose.yml` at the repo root.

| Setting | Value |
|---------|-------|
| Image | `mysql:8.4` |
| Host (from your PC) | `127.0.0.1` |
| Port | `3306` |
| Database | `membership_manager` |
| Username | `laravel` |
| Password | `secret` |
| Root password | `secret` |

Connect with any MySQL GUI using the values above.

### Export a `.sql` dump (optional)

```bash
docker compose exec mysql mysqldump -u laravel -psecret membership_manager > schema.sql
```

Migrations and seeders remain the source of truth; this is just a snapshot.

---

## Troubleshooting

### `could not find driver` or `SQLSTATE[HY000] [2002]`

- Ensure Docker MySQL is running: `docker compose ps`
- Check `.env` matches the table above (`DB_HOST=127.0.0.1`, not `mysql`)
- `DB_HOST=mysql` is only used inside Docker networks; local `php artisan` uses `127.0.0.1`

### `php` or `composer` not found

- Re-run the php.new installer for your OS
- Close and reopen the terminal (or IDE)
- On Windows, use **PowerShell** or **Git Bash** after install

### Port 3306 already in use

Stop other MySQL instances or change the host port in `docker-compose.yml`:

```yaml
ports:
  - "3307:3306"
```

Then set `DB_PORT=3307` in `server/.env`.

### Port 8000 already in use

```bash
php artisan serve --port=8001
```

Update `APP_URL` in `.env` if needed.

---

## Project structure (server)

```
server/
├── app/Http/Controllers/   # API controllers
├── app/Models/             # Eloquent models
├── database/migrations/    # Database schema
├── database/seeders/       # Test data
├── routes/api.php          # API routes
└── config/                 # App config (incl. sanctum.php, cors.php)
```

---

## Teammate checklist

- [ ] Docker Desktop installed and running
- [ ] PHP 8.4+ and Composer installed via php.new
- [ ] Repo cloned
- [ ] `docker compose up -d` from repo root
- [ ] `composer install` in `server/`
- [ ] `.env` created from `.env.example`, `php artisan key:generate`
- [ ] `php artisan migrate`
- [ ] `php artisan serve` → http://127.0.0.1:8000 works
