# Membership Manager — API Server

Laravel REST API for the Membership Manager project. Manages users, members, plans, subscriptions, payments, and check-ins.

**Stack:** PHP 8.4+ (local via [php.new](https://php.new)) · Laravel 13 · MySQL 8.4 (Docker) · Laravel Sanctum (token auth)

**Docs:** [Database guide](docs/database.md) — connect, reset, seed, inspect tables

---

## Prerequisites

Install these once on your machine:

| Tool               | Purpose                                      | Install                                                       |
| ------------------ | -------------------------------------------- | ------------------------------------------------------------- |
| **Docker Desktop** | Runs MySQL only                              | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **PHP 8.4+**       | Runs Laravel                                 | [php.new](https://php.new) — see below                        |
| **Composer**       | PHP dependencies                             | Included with php.new, or `composer self-update`              |
| **Node.js**        | Frontend assets (optional for API-only work) | [nodejs.org](https://nodejs.org/)                             |

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

| Command                            | What it does                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------ |
| `php artisan serve`                | Start API at http://127.0.0.1:8000                                                   |
| `php artisan migrate`              | Run new migrations                                                                   |
| `php artisan migrate:fresh --seed` | Reset DB + test data — [details](docs/database.md#reset-database-and-load-test-data) |
| `php artisan route:list`           | List all API routes                                                                  |
| `composer install`                 | Install PHP packages after pull                                                      |

Database commands, SQL examples, and troubleshooting: **[docs/database.md](docs/database.md)**

---

## API base URL

- **Web / welcome:** `http://127.0.0.1:8000`
- **API routes:** `http://127.0.0.1:8000/api/...`
- **Postman:** base URL `http://127.0.0.1:8000`
- **React client (Vite):** `http://localhost:5173` — allowed by CORS in `config/cors.php`

---

## API reference

This section documents every endpoint implemented in the backend. Use it as the source of truth when building the React client.

### General rules

| Topic | Detail |
| ----- | ------ |
| **Content-Type** | `application/json` for all requests with a body |
| **Auth header** | `Authorization: Bearer <token>` on all routes except `POST /api/register` and `POST /api/login` |
| **Responses** | Eloquent models are returned directly as JSON (no API Resources wrapper) |
| **Validation errors** | `422` with Laravel validation error shape (`{ "message": "...", "errors": { "field": ["..."] } }`) |
| **Forbidden** | `403` when the user role is not allowed |
| **Not found** | `404` when a resource does not exist |

### Roles

| Role | Value in `user.role` | Notes |
| ---- | -------------------- | ----- |
| Admin | `"admin"` | Full access to members, payments, dashboard, plans CRUD |
| Member | `"member"` | Own profile, own payments/check-ins, can self check-in |

Admins do **not** have a `members` row. Members have a linked `members` record via `user_id`.

### List ordering

All collection endpoints return rows ordered by **`updated_at` descending** (most recently
updated first): `GET /plans`, `GET /members`, `GET /payments`, `GET /checkins`. Nested relations
on member detail (`subscriptions`, `payments`, `checkins`) use the same order.

### Subscriptions (no standalone API)

Subscriptions are **not** a top-level REST resource. They are:
- **Created** by `POST /api/payments` (one new subscription per payment)
- **Read** nested on `GET /api/members/{id}` and `GET /api/me/member`

There is no `GET /api/subscriptions` unless you add it later for an admin subscriptions page.

### Active subscription (business rule)

Used by check-ins, member status filters, and dashboard stats:

- A member is **active** when their **latest** subscription (highest `end_date`) has `end_date >= today`.
- A member is **expired** when they have no subscriptions, or their latest subscription's `end_date < today`.

### Test accounts (after `migrate:fresh --seed`)

| Role | Email | Password |
| ---- | ----- | -------- |
| Admin | `admin@example.com` | `password` |
| Member | `alice@example.com` | `password` |
| Member | `bob@example.com` | `password` |
| Member | `claire@example.com` | `password` (expired subscription) |
| Member | `david@example.com` | `password` |
| Member | `emma@example.com` | `password` (expired subscription) |

Seeded plans: **Monthly** (290 DH / 30 days), **Quarterly** (800 DH / 90 days), **Annual** (3000 DH / 365 days).

---

### Data shapes (JSON)

#### User

```json
{
  "id": 1,
  "name": "Alice Martin",
  "email": "alice@example.com",
  "role": "member",
  "email_verified_at": null,
  "created_at": "2026-06-25T00:00:00.000000Z",
  "updated_at": "2026-06-25T00:00:00.000000Z"
}
```

`password` is never returned.

#### Member

```json
{
  "id": 1,
  "user_id": 2,
  "national_id": "NAT100001",
  "phone": "0611111111",
  "created_at": "2026-06-25T00:00:00.000000Z",
  "updated_at": "2026-06-25T00:00:00.000000Z",
  "user": { }
}
```

`user`, `subscriptions`, `payments`, and `checkins` are included when the endpoint loads them (see each route below).

#### Plan

```json
{
  "id": 1,
  "name": "Monthly",
  "price": "290",
  "duration_days": 30,
  "created_at": "2026-06-25T00:00:00.000000Z",
  "updated_at": "2026-06-25T00:00:00.000000Z"
}
```

#### Subscription

```json
{
  "id": 1,
  "member_id": 1,
  "plan_id": 1,
  "start_date": "2026-06-15",
  "end_date": "2026-07-15",
  "created_at": "2026-06-25T00:00:00.000000Z",
  "updated_at": "2026-06-25T00:00:00.000000Z"
}
```

#### Payment

```json
{
  "id": 1,
  "member_id": 1,
  "subscription_id": 1,
  "amount": "290",
  "payment_date": "2026-06-15",
  "created_at": "2026-06-25T00:00:00.000000Z",
  "updated_at": "2026-06-25T00:00:00.000000Z",
  "subscription": { }
}
```

#### Checkin

```json
{
  "id": 1,
  "member_id": 1,
  "checked_in_at": "2026-06-25T09:15:00.000000Z",
  "created_at": "2026-06-25T00:00:00.000000Z",
  "updated_at": "2026-06-25T00:00:00.000000Z"
}
```

#### Dashboard stats

```json
{
  "total_members": 5,
  "active_members": 3,
  "expired_members": 2,
  "revenue_this_month": 290,
  "checkins_today": 2,
  "revenue_by_month": [{ "month": "Jan 2026", "total": 290 }],
  "checkins_by_day": [{ "day": "Mon", "total": 1 }],
  "recent_payments": [{ "id": 1, "member_name": "Alice Martin", "amount": 290, "payment_date": "2026-06-15", "updated_at": "..." }],
  "recent_checkins": [{ "id": 1, "member_name": "Alice Martin", "checked_in_at": "...", "updated_at": "..." }]
}
```

---

### Auth

#### `POST /api/register` — public

Create a new member account (user + member row).

**Body:**

| Field | Type | Required | Rules |
| ----- | ---- | -------- | ----- |
| `name` | string | yes | max 255 |
| `email` | string | yes | valid email, unique |
| `password` | string | yes | min 8 |
| `national_id` | string | yes | max 255 |
| `phone` | string | no | max 255 |

**Response `201`:**

```json
{
  "user": { },
  "token": "1|abc..."
}
```

#### `POST /api/login` — public

**Body:**

| Field | Type | Required |
| ----- | ---- | -------- |
| `email` | string | yes |
| `password` | string | yes |

**Response `200`:**

```json
{
  "user": { },
  "token": "1|abc..."
}
```

**Response `422`** if credentials are wrong.

#### `POST /api/logout` — authenticated

Revokes the current token.

**Response `200`:**

```json
{ "message": "Logged out" }
```

#### `GET /api/me` — authenticated

Returns the logged-in user (no relations).

**Response `200`:** User object.

---

### Plans

#### `GET /api/plans` — authenticated (admin or member)

List all plans.

**Response `200`:** Array of Plan objects.

#### `POST /api/plans` — admin only

**Body:**

| Field | Type | Required | Rules |
| ----- | ---- | -------- | ----- |
| `name` | string | yes | max 255 |
| `price` | number | yes | min 0 |
| `duration_days` | integer | yes | min 1 |

**Response `200`:** Created Plan object.

#### `PUT /api/plans/{id}` — admin only

Same body as create. `{id}` is the plan ID.

**Response `200`:** Updated Plan object.

#### `DELETE /api/plans/{id}` — admin only

**Response `200`:**

```json
{ "message": "Plan deleted" }
```

---

### Members

#### `GET /api/me/member` — member only (authenticated)

Returns the logged-in member's own record with `subscriptions`, `payments`, and `checkins` loaded.

**Response `200`:** Member object with relations.

**Response `404`** if the user has no member row (e.g. admin).

#### `GET /api/members` — admin only

List members with `user` relation loaded.

**Query params (optional):**

| Param | Values | Description |
| ----- | ------ | ----------- |
| `search` | string | Matches `national_id`, user `name`, or user `email` (partial match) |
| `status` | `active` \| `expired` | Filter by latest subscription status |

**Response `200`:** Array of Member objects (each includes `user`).

#### `GET /api/members/{id}` — admin or own member

Returns one member with `user`, `subscriptions`, `payments`, and `checkins` loaded.

**Response `403`** if a member tries to view another member's record.

#### `POST /api/members` — admin only

Create a member (creates user + member in one transaction).

**Body:**

| Field | Type | Required | Rules |
| ----- | ---- | -------- | ----- |
| `name` | string | yes | max 255 |
| `email` | string | yes | valid email, unique |
| `password` | string | yes | min 8 |
| `national_id` | string | yes | max 255 |
| `phone` | string | no | max 255 |

**Response `201`:** Member object with `user` loaded.

#### `PUT /api/members/{id}` — admin only

**Body:**

| Field | Type | Required | Rules |
| ----- | ---- | -------- | ----- |
| `name` | string | yes | max 255 |
| `email` | string | yes | valid email, unique except current user |
| `national_id` | string | yes | max 255 |
| `phone` | string | no | max 255 |

Password is **not** updated through this endpoint.

**Response `200`:** Updated Member object with `user` loaded.

#### `DELETE /api/members/{id}` — admin only

Deletes the member's user (member row cascades).

**Response `200`:**

```json
{ "message": "Member deleted" }
```

---

### Payments

#### `GET /api/payments` — authenticated

- **Admin:** all payments, with `subscription` loaded. Optional `?member_id=` filter.
- **Member:** only own payments, with `subscription` loaded.

**Response `200`:** Array of Payment objects.

#### `POST /api/payments` — admin only

Records a payment and **creates a new subscription** for the member.

**Body:**

| Field | Type | Required | Rules |
| ----- | ---- | -------- | ----- |
| `member_id` | integer | yes | must exist in `members` |
| `plan_id` | integer | yes | must exist in `plans` |
| `amount` | number | no | defaults to plan price |
| `payment_date` | date | no | defaults to today |

**Subscription logic:**

- If the member has an active subscription (`end_date >= today`), the new subscription starts on that subscription's `end_date` (extends membership).
- Otherwise, the new subscription starts today.
- `end_date` = start date + `plan.duration_days`.

**Response `201`:** Payment object with `subscription` loaded.

---

### Check-ins

#### `GET /api/checkins` — authenticated

- **Admin:** all check-ins, ordered by `checked_in_at` descending. Optional `?member_id=` filter.
- **Member:** only own check-ins, same ordering.

**Response `200`:** Array of Checkin objects.

#### `POST /api/checkins` — authenticated

Creates a check-in with `checked_in_at` set to the current time.

| Caller | `member_id` in body |
| ------ | ------------------- |
| Admin | **Required** — which member to check in |
| Member | **Ignored** — uses the logged-in member's own record |

**Pre-check:** the target member must have an active subscription (latest `end_date >= today`). Otherwise:

**Response `422`:**

```json
{ "message": "Member has no active subscription." }
```

**Response `201`:** Created Checkin object.

---

### Dashboard

#### `GET /api/dashboard` — admin only

**Response `200`:**

| Field | Description |
| ----- | ----------- |
| `total_members` | Count of all members |
| `active_members` | Members whose latest subscription has `end_date >= today` |
| `expired_members` | `total_members - active_members` |
| `revenue_this_month` | Sum of `payments.amount` where `payment_date` is in the current calendar month |
| `checkins_today` | Count of check-ins where `checked_in_at` is today |
| `revenue_by_month` | Last 6 calendar months — `{ month, total }[]` for charts |
| `checkins_by_day` | Last 7 days — `{ day, total }[]` for charts |
| `recent_payments` | 5 latest payments with member name |
| `recent_checkins` | 5 latest check-ins with member name |

**Response `403`** for non-admin users.

---

### Endpoint summary

| Method | Path | Auth | Role |
| ------ | ---- | ---- | ---- |
| POST | `/api/register` | — | public |
| POST | `/api/login` | — | public |
| POST | `/api/logout` | token | any |
| GET | `/api/me` | token | any |
| GET | `/api/plans` | token | any |
| POST | `/api/plans` | token | admin |
| PUT | `/api/plans/{id}` | token | admin |
| DELETE | `/api/plans/{id}` | token | admin |
| GET | `/api/me/member` | token | member |
| GET | `/api/members` | token | admin |
| POST | `/api/members` | token | admin |
| GET | `/api/members/{id}` | token | admin or own |
| PUT | `/api/members/{id}` | token | admin |
| DELETE | `/api/members/{id}` | token | admin |
| GET | `/api/payments` | token | any (scoped) |
| POST | `/api/payments` | token | admin |
| GET | `/api/checkins` | token | any (scoped) |
| POST | `/api/checkins` | token | any |
| GET | `/api/dashboard` | token | admin |

### React client notes

When wiring the frontend:

1. Store the token from login/register (e.g. `localStorage`) and send it on every request.
2. After login, read `user.role` to route admins vs members to different views.
3. For members, `GET /api/me/member` is the main profile endpoint (subscriptions, payments, check-ins).
4. For admins, use `GET /api/members`, `GET /api/dashboard`, and `POST /api/payments` for core workflows.
5. Check-in button for members: `POST /api/checkins` with an empty body; handle `422` for expired subscriptions.
6. API base URL for fetch/axios: `http://127.0.0.1:8000/api`.

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
