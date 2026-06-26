# Membership Manager — React Client

React admin dashboard for the Membership Manager project. Talks to the Laravel API in
[`../server/`](../server/) using **SWR + fetch** with Bearer token auth.

**Stack:** React 19 · Vite 6 · TypeScript · MUI v7 · Modernize dashboard template · SWR

**API docs:** [server/README.md → API reference](../server/README.md#api-reference)

**UI reference:** [Modernize React docs](https://adminmart.github.io/premium-documentation/react/modernize/index.html) · [Live demo](https://modernize-react.adminmart.com/dashboards/modern)

**Build prompts:** [frontend-prompts.md](frontend-prompts.md)

---

## What this app does

- **Admin** — dashboard, plans, members, payments, check-ins
- **Member** — own dashboard, self check-in, payment and subscription history

Auth is token-based (Laravel Sanctum). After login, the app stores the token in
`localStorage` and sends it on every API request.

---

## Project layout

```
client/
├── src/                    # App you work in (routes, views, API, auth)
├── complete-project/       # Full Modernize template — READ ONLY, copy UI from here
├── public/
├── .env                    # VITE_API_URL (create from .env.example)
├── frontend-prompts.md     # Step-by-step build prompts
└── package.json
```

> **Important:** Never edit `complete-project/`. When you need a table, form, or widget,
> find it there and copy it into `src/`.

---

## Prerequisites

| Tool        | Purpose              | Install                          |
| ----------- | -------------------- | -------------------------------- |
| **Node.js** | Runs Vite dev server | [nodejs.org](https://nodejs.org/) (LTS recommended) |
| **npm**     | Package manager      | Included with Node.js            |

You also need the **API server** running — see [server/README.md](../server/README.md).

---

## First-time setup (new clone)

All commands below assume you are in the **`client/`** folder unless noted.

### 1. Install dependencies

```bash
cd client
npm install
```

### 2. Environment file

```bash
cp .env.example .env
```

Default API URL (must match a running Laravel server):

```
VITE_API_URL=http://127.0.0.1:8000/api
```

### 3. Start the backend (required)

The client cannot work without the API. From the repo root:

```bash
docker compose up -d
```

From `server/`:

```bash
composer install
cp .env.example .env          # skip if already done
php artisan key:generate      # skip if APP_KEY is set
php artisan migrate:fresh --seed
php artisan serve
```

Full backend guide: **[../server/README.md](../server/README.md)**

### 4. Start the development server

```bash
cd client
npm run dev
```

Open **http://localhost:5173** — you should see the login page.

---

## Daily development

Use **two terminals** (or run the API in the background):

**Terminal 1 — API** (from `server/`):

```bash
php artisan serve
```

**Terminal 2 — Client** (from `client/`):

```bash
npm run dev
```

| URL | What |
| --- | ---- |
| http://localhost:5173 | React app |
| http://127.0.0.1:8000/api/... | Laravel API |

MySQL (if stopped): `docker compose up -d` from the **repo root**.

---

## Test accounts

After `php artisan migrate:fresh --seed` on the server:

| Role   | Email               | Password   |
| ------ | ------------------- | ---------- |
| Admin  | `admin@example.com` | `password` |
| Member | `alice@example.com` | `password` |

More seeded members: `bob@example.com`, `claire@example.com` (expired), etc. — see
[server/README.md](../server/README.md#test-accounts-after-migratefresh---seed).

---

## Common commands

Run from **`client/`**:

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Dev server at http://localhost:5173    |
| `npm run build`   | Typecheck + production build to `dist/` |
| `npm run preview` | Preview production build locally      |
| `npm run lint`    | Run ESLint                            |

---

## Working on features

1. Read the API for the feature in **[server/README.md](../server/README.md)**
2. Follow **[frontend-prompts.md](frontend-prompts.md)** prompt by prompt
3. Copy UI patterns from `complete-project/src/` into `src/` when needed
4. Install extra packages from `complete-project/package.json` only when a prompt requires them
   (e.g. `@mui/x-date-pickers` and `dayjs` for payments)

### Copy workflow

1. Find the file under `complete-project/src/...`
2. Copy to the same path under `src/...`
3. Copy any missing imports / assets it depends on
4. `npm install <package>` if a dependency is missing from `client/package.json`

---

## Troubleshooting

### Blank page or network errors on login

- Confirm the API is running: `http://127.0.0.1:8000`
- Check `VITE_API_URL` in `.env` ends with `/api`
- Restart `npm run dev` after changing `.env`

### CORS errors

The API allows `http://localhost:5173` and `http://127.0.0.1:5173` — use one of those URLs,
not a random port.

### `npm run build` fails

Run `npm run build` and fix TypeScript errors shown in the output.

### Port 5173 already in use

Vite will offer the next free port, or stop the other process using 5173.

---

## Related docs

- Monorepo overview: [../README.md](../README.md)
- API server setup & endpoints: [../server/README.md](../server/README.md)
- Database reset & SQL: [../server/docs/database.md](../server/docs/database.md)
- Frontend build prompts: [frontend-prompts.md](frontend-prompts.md)
