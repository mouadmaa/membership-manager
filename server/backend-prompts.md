# Membership Manager — Backend (Laravel)

A generic membership-management REST API (works for any membership-based business — gym, club, library, etc.). Two roles: **admin** (manages everything) and **member** (manages only their own data).

**Final schema (6 tables):**

1. `users` — login/auth for both roles (`role` column: `admin` or `member`)
2. `members` — profile data for role=member users only (`user_id` FK, `national_id`, optional `phone`)
3. `plans` — membership plans (name, price, duration)
4. `subscriptions` — one row per paid membership period (history)
5. `payments` — money received, linked to the subscription it paid for
6. `checkins` — visit/attendance log

**Project layout:** Laravel lives in `membership-manager/server/`. MySQL runs via Docker from `membership-manager/docker-compose.yml`. PHP runs locally (installed via [php.new](https://php.new)).

---

## Part 1 — Setup (do this yourself, before using any prompts)

You need **Docker** (MySQL only) and **PHP + Composer** on your machine (via php.new — no XAMPP).

### 1. Install PHP and Composer (php.new)

**Windows (PowerShell):**

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

Close and reopen your terminal, then verify: `php --version` and `composer --version`.

### 2. Clone / open the project

The repo structure:

```
membership-manager/
├── docker-compose.yml    ← MySQL
├── client/               ← React (later)
└── server/               ← Laravel API (work here)
```

### 3. Start MySQL

From `membership-manager` (repo root):

```bash
docker compose up -d
```

### 4. Install Laravel dependencies and configure

From `membership-manager/server`:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### 5. Start the API server

```bash
php artisan serve
```

### 6. Verify it's running

Open **http://127.0.0.1:8000** in your browser. You should see the Laravel welcome page — that confirms PHP + Laravel + MySQL are all working.

### 7. Sanctum (already installed in this project)

If setting up from scratch on a new Laravel app, you would run:

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### Commands you'll use a lot

Run from `membership-manager/server`:

| Command                            | What it does                              |
| ---------------------------------- | ----------------------------------------- |
| `docker compose up -d`             | Start MySQL (run from repo root)          |
| `docker compose down`              | Stop MySQL (run from repo root)           |
| `php artisan serve`                | Start API at http://127.0.0.1:8000        |
| `php artisan migrate`              | Run new migrations                        |
| `php artisan migrate:fresh --seed` | Wipe DB, rebuild tables, reseed test data |
| `php artisan route:list`           | See all registered API routes             |

Full teammate onboarding docs: `membership-manager/server/README.md`

### Bonus — exporting a raw `.sql` file (optional, only if you want to show your teacher a traditional dump)

Once migrated and seeded, from repo root:

```bash
docker compose exec mysql mysqldump -u laravel -psecret membership_manager > schema.sql
```

(Migrations + seeders are the actual source of truth though — this is just a snapshot export.)

---

## Part 2 — How to use the prompts below

Open **Claude Code** in the `membership-manager/server` folder. Paste **Prompt 0** first (it sets the ground rules for the whole session). Then paste each numbered prompt **in order**, reviewing the result before moving to the next one — don't skip ahead.

---

### Prompt 0 — Ground rules

```
We're building a Laravel REST API backend for a school project called "Membership Manager" —
a generic membership management system (works for gyms, clubs, libraries, etc., not tied to
one specific business type). I'm new to Laravel, so keep the implementation deliberately
simple the whole way through:

- No Form Request classes — validate directly inside controller methods with $request->validate().
- No API Resource classes — just return Eloquent models/collections directly, Laravel converts
  them to JSON automatically.
- No Service or Repository layers — put logic directly in the controller methods.
- No Policies, Gates, or custom Middleware classes for authorization — just check
  $request->user()->role === 'admin' inline in the method and abort(403) if not allowed.
- No automated tests.
- Minimal comments — only what a student would naturally write, not exhaustive explanations.
- Standard Laravel structure: routes/api.php, app/Models, app/Http/Controllers, snake_case
  DB columns, Eloquent relationships (hasMany/belongsTo/hasOne) defined on the models.

I'll give you the rest of the features one at a time in follow-up prompts that build on top
of each other. Confirm you understand these rules, then wait for the next prompt.
```

---

### Prompt 1 — Database schema (migrations + models)

```
Create the database schema below using Laravel migrations, plus the matching Eloquent
models with relationships. Use MySQL-appropriate column types.

1. users (Laravel's default table — just add one column)
   - role: string, default 'member' (values used: 'admin' or 'member')

2. members — profile data for role=member users only
   - user_id: foreign key to users, unique, cascade on delete
   - national_id: string, required (national identity card number)
   - phone: string, nullable

3. plans
   - name: string
   - price: decimal(8,2)
   - duration_days: integer

4. subscriptions — one row per membership period a member has paid for
   - member_id: foreign key to members, cascade on delete
   - plan_id: foreign key to plans
   - start_date: date
   - end_date: date

5. payments
   - member_id: foreign key to members, cascade on delete
   - subscription_id: foreign key to subscriptions, cascade on delete
   - amount: decimal(8,2)
   - payment_date: date

6. checkins
   - member_id: foreign key to members, cascade on delete
   - checked_in_at: datetime

Model relationships to add:
- User: hasOne Member
- Member: belongsTo User, hasMany Subscription, hasMany Payment, hasMany Checkin
- Plan: hasMany Subscription
- Subscription: belongsTo Member, belongsTo Plan, hasMany Payment
- Payment: belongsTo Member, belongsTo Subscription
- Checkin: belongsTo Member

Run the migrations after creating them.
```

---

### Prompt 2 — Seeders (test data)

```
Create a database seeder that fills in test data:
- 1 admin user: email admin@example.com, password "password", role admin (no members row needed)
- 3 plans, e.g. Monthly (30 days), Quarterly (90 days), Annual (365 days), with reasonable prices
- 5 member users (role member), each with a matching members row (with a unique national_id and a phone number)
- For each member, 1-2 subscriptions tied to a plan with realistic start/end dates — make some
  currently active and some already expired — plus a matching payment row for each subscription
- A handful of checkins spread across a few members over the last week

Wire it into DatabaseSeeder so `php artisan migrate:fresh --seed` populates everything in one go.
```

---

### Prompt 3 — Authentication (Sanctum)

```
Add token-based authentication using Laravel Sanctum, with these endpoints under /api:

- POST /register — name, email, password, national_id, phone (optional). Always creates role=member, plus the
  matching members row, in the same request. Returns the user + token.
- POST /login — email, password. Returns the user (including role) + token.
- POST /logout — revokes the current token. Protected by auth:sanctum.
- GET /me — returns the currently authenticated user. Protected by auth:sanctum.

Configure config/cors.php and Sanctum so a React app running on http://localhost:5173 can call
this API using the Authorization: Bearer <token> header. We're using plain API tokens (not
Sanctum's SPA cookie mode), so no CSRF/cookie config is needed.
```

---

### Prompt 4 — Plans management (admin only)

```
Add REST endpoints for plans under /api/plans:

- GET /api/plans — any authenticated user can view (members need this to see plan options)
- POST /api/plans — admin only
- PUT /api/plans/{id} — admin only
- DELETE /api/plans/{id} — admin only

For the admin-only ones, check $request->user()->role === 'admin' inside the method and
abort(403) otherwise.
```

---

### Prompt 5 — Members management

```
Add REST endpoints for managing members under /api/members:

- GET /api/members — admin only. List all members with their user info (name, email, national_id, phone).
  Support optional query params: ?search=text (matches name, email, or national_id) and
  ?status=active|expired (based on whether their latest subscription's end_date is in the
  future or not).
- GET /api/members/{id} — admin only, or a member fetching their own record. Returns the
  member with their subscriptions, payments, and checkins loaded.
- POST /api/members — admin only. Creates a new user (role=member) + members row together
  (name, email, password, national_id, phone).
- PUT /api/members/{id} — admin only. Updates name, email, national_id, phone.
- DELETE /api/members/{id} — admin only. Deletes the member (subscriptions/payments/checkins
  cascade-delete via the DB foreign keys).
- GET /api/me/member — for a logged-in member, returns their own member record with
  subscriptions, payments, and checkins loaded, so the member UI doesn't need to know its own
  member id.
```

---

### Prompt 6 — Payments & subscriptions

```
Add an endpoint that records a payment and automatically creates/extends a subscription:

- POST /api/payments — admin only.
  Input: member_id, plan_id, amount (optional, default to the plan's price),
  payment_date (optional, default to today).

  Logic:
  1. Find the member's most recent subscription where end_date >= today (i.e. still active).
  2. If one exists, start_date = that subscription's end_date. Otherwise, start_date = today.
  3. end_date = start_date + plan.duration_days (use Carbon for the date math).
  4. Create a new subscription row with these dates.
  5. Create a payment row linked to that subscription, with the given amount and payment_date.
  6. Return the created payment with its subscription loaded.

- GET /api/payments — admin sees all (optionally filter with ?member_id=), a member sees
  only their own.
```

---

### Prompt 7 — Check-ins

```
Add check-in endpoints under /api/checkins:

- POST /api/checkins —
  - If the logged-in user is admin: member_id is required in the request body.
  - If the logged-in user is a member: ignore any member_id sent, use their own member record.
  Before creating the row, check the member has an active subscription (latest subscription's
  end_date >= today). If not, return a 422 with a message like "Member has no active
  subscription."

- GET /api/checkins — admin sees all (optionally filter with ?member_id=), a member sees only
  their own, ordered most recent first.
```

---

### Prompt 8 — Dashboard stats (admin only)

```
Add GET /api/dashboard, admin only, returning a JSON object with:
- total_members
- active_members (latest subscription end_date >= today)
- expired_members (total_members - active_members)
- revenue_this_month (sum of payments.amount where payment_date is in the current month)
- checkins_today (count of checkins where checked_in_at is today)

Keep the queries simple and directly in the controller method.
```
