# Membership Manager — Frontend (React)

**Status: complete** (Prompts 0–7). App branding: **MemberShip** (`src/config/app.ts`).

React + Vite + **Modernize** admin dashboard (MUI v7), talking to the Laravel API via **SWR +
fetch** with Bearer token auth.

**Work in:** `membership-manager/client/` (the starter project)

**Copy UI from:** `membership-manager/client/complete-project/` (read-only reference — never edit
this folder; copy files into `client/src/`)

**API contract:** `membership-manager/server/README.md` (API reference section)

**Theme/docs:** [Modernize React documentation](https://adminmart.github.io/premium-documentation/react/modernize/index.html)

**Live demo reference:** [Modern dashboard](https://modernize-react.adminmart.com/dashboards/modern)

---

## Part 1 — Setup (do this yourself, before using any prompts)

The Vite + Modernize starter already exists in `client/`. No need to create a new project.

### 1. Install dependencies

```bash
cd client
npm install
```

For **Prompt 4 (Payments)** you will also need:

```bash
npm install @mui/x-date-pickers@^8.2.0 dayjs
```

For **Prompt 6 (Dashboard charts)**:

```bash
npm install apexcharts react-apexcharts
```

### 2. Point it at your backend

Create `client/.env`:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

### 3. Start the backend

From `server/`:

```bash
docker compose up -d          # from repo root, if MySQL isn't running
php artisan serve
php artisan migrate:fresh --seed   # first time or when you need test data
```

### 4. Run the frontend

```bash
cd client
npm run dev
```

Open **http://localhost:5173**

### 5. Copy workflow (when a prompt says "copy from complete-project")

1. Find the file under `client/complete-project/src/...`
2. Copy it to the same path under `client/src/...`
3. If the copied file imports something missing, copy that dependency too
4. If it needs an npm package only in `complete-project/package.json`, install it in `client/`

**Never modify files inside `complete-project/`.**

---

## Part 2 — How to use the prompts below

Open Cursor in the **`client/`** folder. Paste **Prompt 0** first, then each numbered prompt
**in order**. Review and test before moving on. Keep `server/README.md` open for API details.

Test accounts (after seed): `admin@example.com` / `password`, `alice@example.com` / `password`

Say **"Prompt X accepted"** when a step works before starting the next.

---

## Ground rules

- **UI:** MUI + Modernize layout (`FullLayout`, `BlankCard`, `PageContainer`, etc.) — no Tailwind, no shadcn
- **API:** SWR for GET requests; `api/fetcher.ts` helpers for POST/PUT/DELETE with `Authorization: Bearer <token>`
- **Roles:** `user.role` is `"admin"` or `"member"` from Laravel
- **Layout:** Both roles use the same `FullLayout` (sidebar + header); sidebar menu differs by role
- **Code style:** Keep it simple — validate in components, no extra abstraction layers

### Target sidebar menus

**Admin:** Dashboard, Plans, Members, Payments, Check-ins

**Member:** Dashboard, Check in

---

## Implementation notes (current build)

| Item | Detail |
| ---- | ------ |
| App name | **MemberShip** — logo + login/register (`src/config/app.ts`) |
| Currency | Prices shown as **DH** via `formatMoney()` |
| List order | Tables use API order (`updated_at` DESC) |
| Theme customizer | Hidden (Modernize settings FAB removed from `FullLayout`) |
| Subscriptions page | **Not built** — subs visible on member drawer + member dashboard; created via payments only |
| Dashboard | Stat cards + revenue bar chart, membership donut, check-ins area chart, recent activity tables |

---

### Prompt 0 — Project context & shared setup

```
This is the frontend for "Membership Manager", talking to the Laravel REST API documented in
../server/README.md. Base URL: import.meta.env.VITE_API_URL (e.g. http://127.0.0.1:8000/api).

Set up shared plumbing in client/:

1. api/fetcher.ts — fetch helpers that prefix VITE_API_URL, attach Bearer token from
   localStorage, and parse Laravel errors (422 message + errors object). Export getFetcher,
   postFetcher, putFetcher, deleteFetcher for SWR and mutations.

2. context/AuthContext.tsx — hold user + token; expose login, register, logout; persist token
   in localStorage; on load call GET /me to restore session.

3. routes/ProtectedRoute.tsx — redirect unauthenticated users to /auth/login; block wrong role
   (admin routes vs member routes).

4. Update routes/Router.tsx:
   - /auth/login, /auth/register → BlankLayout
   - /admin/* → FullLayout + admin guard
   - /member/* → FullLayout + member guard
   - / → redirect based on auth state / role

5. Role-based sidebar — update layouts/full/vertical/sidebar/MenuItems.ts (or equivalent) so
   admin and member see different menus (see Ground rules above).

6. Wrap app in AuthContextProvider in main.tsx.

7. Update header Profile.tsx — show logged-in user name/email and a Logout action.

8. npm install swr if not already installed.

Copy from complete-project when needed:
- components/forms/theme-elements/CustomTextField.tsx
- components/forms/theme-elements/CustomFormLabel.tsx
- components/forms/theme-elements/CustomCheckbox.tsx

Acceptance: app loads; unauthenticated visit to /admin/dashboard redirects to login; after
manual token test or Prompt 1, admin sees admin menu and member sees member menu.
```

---

### Prompt 1 — Auth pages

```
Build login and register using Modernize auth1 layout. Copy from complete-project and adapt:

Copy:
- views/authentication/auth1/Login.tsx
- views/authentication/auth1/Register.tsx
- views/authentication/authForms/AuthLogin.tsx (wire to API — remove social buttons)
- views/authentication/authForms/AuthRegister.tsx (add national_id, phone fields)
- assets/images/backgrounds/login-bg.svg (if missing)

Routes (BlankLayout):
- /auth/login — email + password → POST /login → store token + user → redirect by role
  (admin → /admin/dashboard, member → /member/dashboard)
- /auth/register — name, email, password, national_id, phone (optional) → POST /register
  → always member → /member/dashboard

Use MUI Alert for API errors. Remove AuthSocialButtons / forgot-password links (not used).
Use CustomTextField + CustomFormLabel from theme-elements.

Acceptance: admin@example.com logs in → admin dashboard route; alice@example.com → member
dashboard; invalid credentials show error; register creates account and logs in.
```

---

### Prompt 2 — Admin: Plans management

```
Build /admin/plans using MUI Table inside PageContainer + BlankCard (copy ParentCard from
complete-project if helpful).

API (see server/README.md):
- GET /plans (SWR)
- POST /plans, PUT /plans/{id}, DELETE /plans/{id} — admin only

Features:
- Table: name, price, duration_days
- "Add plan" → MUI Dialog with form
- Edit and Delete per row (confirm before delete)

Copy reference: views/tables/BasicTable.tsx, components/shared/ParentCard.tsx

Acceptance: admin can list, create, edit, delete plans; member gets 403 on mutations.
```

---

### Prompt 3 — Admin: Members management

```
Build /admin/members (+ detail view).

API:
- GET /members?search=&status=active|expired
- POST /members, PUT /members/{id}, DELETE /members/{id}
- GET /members/{id} — subscriptions, payments, checkins

Features:
- Table: name, email, national_id, phone, Active/Expired Chip
- Search input + status filter (All / Active / Expired)
- Add member dialog (name, email, password, national_id, phone)
- Edit / delete per row
- Row click → detail drawer or page with subscriptions, payments, check-ins

Copy reference: views/apps/contacts/ and components/apps/contacts/ for search/filter patterns

Acceptance: search and filters hit API query params; detail shows related data.
```

---

### Prompt 4 — Admin: Payments

```
Build /admin/payments.

Install: npm install @mui/x-date-pickers dayjs

API:
- POST /payments — member_id, plan_id, amount (optional), payment_date (optional)
- GET /payments?member_id= (optional filter)

Features:
- Form: member select, plan select (auto-fill amount from plan price, editable), payment date
  (default today) using MUI DatePicker
- Table below: member name, plan, amount, subscription start/end, payment_date

Copy reference: views/forms/FormVertical.tsx, views/forms/form-elements/MuiDateTime.tsx

Acceptance: recording payment creates row and extends subscription per API rules.
```

---

### Prompt 5 — Check-ins (admin + member)

```
Admin: /admin/checkins
- Member select + "Check in" → POST /checkins with member_id
- Table of recent check-ins from GET /checkins (?member_id= optional)
- Show MUI Alert on 422: "Member has no active subscription."

Member: /member/checkin
- "Check in" button → POST /checkins (empty body)
- List own check-ins below

Acceptance: active member can check in; expired member (claire@example.com) sees error;
admin can check in any active member.
```

---

### Prompt 6 — Admin dashboard ✅

```
Build /admin/dashboard.

API: GET /dashboard — total_members, active_members, expired_members, revenue_this_month,
checkins_today, revenue_by_month, checkins_by_day, recent_payments, recent_checkins

Copy/adapt: components/dashboards/modern/TopCards.tsx — five stat cards with Tabler icons.

Charts (apexcharts): revenue (6 months), membership donut, check-ins (7 days), recent tables.

Install: npm install apexcharts react-apexcharts

Acceptance: stats match API; non-admin gets 403.
```

---

### Prompt 7 — Member dashboard ✅

```
Build /member/dashboard.

API: GET /me/member — member with subscriptions, payments, checkins

UI (read-only):
- Current subscription: active/expired badge, plan name, end date
- Payment history table
- Check-in history list

Same FullLayout with member sidebar menu.

Acceptance: member sees only their data; matches API for alice@example.com.
```

---

### Optional future work (not implemented)

**Admin subscriptions page** — would need `GET /api/subscriptions` (and optional filters) plus
`/admin/subscriptions` UI. Current design keeps subscriptions nested on members and created only
via payments. Add only if you need a global subscription list or manual subscription edits.
