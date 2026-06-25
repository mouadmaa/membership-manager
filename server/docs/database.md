# Database guide

How to connect, reset, seed, and inspect the **Membership Manager** MySQL database in local development.

**Stack:** MySQL 8.4 runs in Docker (`../docker-compose.yml`). Laravel connects from your PC via `127.0.0.1`.

---

## Connection settings

These match `server/.env`:

| Setting | Value |
|---------|-------|
| Image | `mysql:8.4` |
| Host (from your PC) | `127.0.0.1` |
| Port | `3306` |
| Database | `membership_manager` |
| Username | `laravel` |
| Password | `secret` |
| Root password | `secret` |

Use the same values in **TablePlus**, **DBeaver**, **MySQL Workbench**, etc.

> MySQL speaks the MySQL protocol, not HTTP. Do **not** open `http://localhost:3306` in a browser.

### Start / stop MySQL

From **`membership-manager`** root (one folder above `server/`):

```bash
docker compose up -d      # start
docker compose ps         # check status (mysql should be "healthy")
docker compose down       # stop
```

---

## Schema overview

Main application tables (see `database/migrations/`):

| Table | Purpose |
|-------|---------|
| `users` | Login accounts (`role`: `admin` or `member`) |
| `members` | Member profile (`national_id`, `phone`) linked to `users` |
| `plans` | Membership plans (name, price, duration_days) |
| `subscriptions` | Paid membership periods per member |
| `payments` | Payments linked to subscriptions |
| `checkins` | Visit / attendance log |

Laravel also creates helper tables: `migrations`, `sessions`, `cache`, `jobs`, `personal_access_tokens`, etc.

**Source of truth:** migrations in `database/migrations/` and seed data in `database/seeders/DatabaseSeeder.php`.

---

## Migrations and seeders

Run from **`server/`**.

| Command | What it does |
|---------|----------------|
| `php artisan migrate` | Run **new** migrations only; keeps existing data |
| `php artisan migrate:fresh` | Drop all tables, recreate schema (**empty** tables) |
| `php artisan migrate:fresh --seed` | Drop all tables, recreate schema, **then load test data** |
| `php artisan db:seed` | Run seeders only (tables must already exist) |
| `php artisan migrate:status` | List which migrations have run |

### What does `migrate:fresh --seed` mean?

| Part | Meaning |
|------|---------|
| `php artisan` | Laravel command-line tool |
| `migrate:fresh` | **Deletes every table**, then runs **all migrations** again |
| `--seed` | Runs `DatabaseSeeder` to insert default test data |

One command = **wipe → rebuild structure → fill init data**.

> **Warning:** Deletes all data. Local development only — never on production.

---

## Reset database and load test data

Use when you want a clean database with the default sample data again.

```bash
# 1. MySQL running (from membership-manager root)
cd ..
docker compose up -d

# 2. Reset + seed (from server/)
cd server
php artisan migrate:fresh --seed
```

### Test accounts after seeding

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `password` |
| Member | `alice@example.com` | `password` |
| Member | `bob@example.com` | `password` |
| Member | `claire@example.com` | `password` |
| Member | `david@example.com` | `password` |
| Member | `emma@example.com` | `password` |

Full seed logic: `database/seeders/DatabaseSeeder.php`.

---

## Inspect tables from the terminal

These commands run **inside** the MySQL Docker container. Run from **`membership-manager`** root.

### Command breakdown

```bash
docker compose exec mysql mysql -ularavel -psecret membership_manager -e "DESCRIBE members;"
```

| Piece | Meaning |
|-------|---------|
| `docker compose exec mysql` | Execute a command in the running MySQL container |
| `mysql` | MySQL client |
| `-ularavel` | User `laravel` (same as `DB_USERNAME`) |
| `-psecret` | Password `secret` (no space after `-p`) |
| `membership_manager` | Database name |
| `-e "..."` | Run this SQL once and print the result |

### Common queries

**Table structure** (columns, types, nullable):

```bash
docker compose exec mysql mysql -ularavel -psecret membership_manager -e "DESCRIBE members;"
```

**All rows in a table:**

```bash
docker compose exec mysql mysql -ularavel -psecret membership_manager -e "SELECT * FROM members;"
```

```bash
docker compose exec mysql mysql -ularavel -psecret membership_manager -e "SELECT name, email, role FROM users;"
```

**Row counts:**

```bash
docker compose exec mysql mysql -ularavel -psecret membership_manager -e "
SELECT 'users' AS table_name, COUNT(*) AS rows FROM users
UNION SELECT 'members', COUNT(*) FROM members
UNION SELECT 'plans', COUNT(*) FROM plans
UNION SELECT 'subscriptions', COUNT(*) FROM subscriptions
UNION SELECT 'payments', COUNT(*) FROM payments
UNION SELECT 'checkins', COUNT(*) FROM checkins;
"
```

**Members with subscription status:**

```bash
docker compose exec mysql mysql -ularavel -psecret membership_manager -e "
SELECT u.name, m.national_id, p.name AS plan, s.end_date,
  CASE WHEN s.end_date >= CURDATE() THEN 'active' ELSE 'expired' END AS status
FROM subscriptions s
JOIN members m ON m.id = s.member_id
JOIN users u ON u.id = m.user_id
JOIN plans p ON p.id = s.plan_id;
"
```

Swap `members` for `users`, `plans`, `subscriptions`, `payments`, or `checkins` as needed.

---

## Laravel alternatives (no raw SQL)

From **`server/`**:

```bash
php artisan db:show
```

```bash
php artisan tinker
```

```php
\App\Models\User::with('member')->get();
\App\Models\Member::with('subscriptions.plan')->get();
\App\Models\Plan::all();
exit
```

---

## Export a `.sql` dump (optional)

Snapshot for your teacher or backup. Migrations + seeders remain the real source of truth.

From **`membership-manager`** root:

```bash
docker compose exec mysql mysqldump -u laravel -psecret membership_manager > schema.sql
```

---

## Troubleshooting

### `could not find driver` or `SQLSTATE[HY000] [2002]`

- MySQL container running? `docker compose ps`
- `.env` uses `DB_HOST=127.0.0.1` (not `mysql`) when running `php artisan` on your PC
- `DB_HOST=mysql` is only for apps running inside the Docker network

### Port 3306 already in use

Change the host port in `docker-compose.yml`:

```yaml
ports:
  - "3307:3306"
```

Then set `DB_PORT=3307` in `server/.env`.

### `php artisan db:show` — intl extension error

Use the Docker `mysql` commands above, or enable the PHP `intl` extension in your php.new / herd-lite install.
