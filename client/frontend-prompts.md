# Membership Manager — Frontend (React)

React + Vite + Tailwind CSS + shadcn/ui, talking to the Laravel API via axios with Bearer
token auth. You're solid in React already, so these prompts don't dumb anything down —
build it the way you normally would.

---

## Part 1 — Setup (do this yourself, before using any prompts)

You already have Node.js, so no Docker needed here — this runs directly on your machine.

### 1. Create the Vite + React project
```bash
npm create vite@latest membership-manager-frontend -- --template react
cd membership-manager-frontend
npm install
```

### 2. Install Tailwind CSS
```bash
npm install tailwindcss @tailwindcss/vite
```

### 3. Set up shadcn/ui
```bash
npx shadcn@latest init
```
Follow the prompts (Tailwind will already be detected).

### 4. Install router + HTTP client
```bash
npm install react-router-dom axios
```

### 5. Point it at your backend
Create a `.env` file in the project root:
```
VITE_API_URL=http://localhost
```
(Check `sail artisan route:list` on the backend side if your API isn't on plain `http://localhost`.)

### 6. Run the dev server
```bash
npm run dev
```
Open the URL it prints (usually `http://localhost:5173`) — seeing the Vite+React starter page confirms the frontend is running. Once you start Prompt 0 below, this URL becomes your real app.

---

## Part 2 — How to use the prompts below

Open **Claude Code** in the `membership-manager-frontend` folder. Paste **Prompt 0** first (it sets up the shared plumbing). Then paste each numbered prompt **in order**, reviewing the result before moving to the next one. Make sure the backend (Part 1 of the backend file) is up and migrated/seeded before testing login.

---

### Prompt 0 — Project context & shared setup

```
This is the frontend for "Membership Manager", a generic membership-management app (works
for any membership-based business — gym, club, library, etc.), talking to a Laravel REST API
at the URL in VITE_API_URL via axios with Bearer token auth. Tokens come back from /login and
/register. There are two roles, "admin" and "member", returned in the user object from the API.

Set up:
- An axios instance (e.g. src/lib/api.js) using the base URL from the env var, with a request
  interceptor that attaches "Authorization: Bearer <token>" to every request.
- An AuthContext (or your preferred pattern) holding the current user/token, exposing
  login/register/logout, persisting the token in localStorage so a refresh keeps the session,
  and redirecting to /login if there's no valid session.
- React Router setup with route guards: unauthenticated -> /login; authenticated admin ->
  routes under /admin/*; authenticated member -> routes under /member/*.

Structure components/folders however you'd normally do it — no need to keep this simple,
build it properly.
```

---

### Prompt 1 — Auth pages

```
Build the login and register pages:

- /login — email + password, calls POST /login, stores token + user, redirects based on role
  (admin -> /admin/dashboard, member -> /member/dashboard).
- /register — name, email, password, phone, calls POST /register (always creates a member),
  logs them in, redirects to /member/dashboard.

Use shadcn/ui form components, basic client-side validation (required fields, valid email
format), and surface the API's error message if login/register fails.
```

---

### Prompt 2 — Admin: Plans management

```
Build an admin page at /admin/plans:
- Table listing all plans (name, price, duration_days) from GET /api/plans.
- "Add plan" button opening a shadcn Dialog with a form (name, price, duration_days) ->
  POST /api/plans.
- Edit and delete actions per row -> PUT/DELETE /api/plans/{id}.

Use shadcn/ui Table, Dialog, Button, and Input components.
```

---

### Prompt 3 — Admin: Members management

```
Build an admin page at /admin/members:
- Table listing all members (name, email, phone, an Active/Expired status badge) from
  GET /api/members.
- A search input and a status filter (All/Active/Expired) that pass ?search= and ?status=
  query params to the API.
- "Add member" button -> Dialog with a form (name, email, password, phone) -> POST /api/members.
- Edit and delete actions per row.
- Clicking a row opens a detail view (drawer or separate page) showing that member's
  subscriptions, payments, and checkins, from GET /api/members/{id}.
```

---

### Prompt 4 — Admin: Payments

```
Build an admin page at /admin/payments:
- A form to record a new payment: searchable member select, plan select (auto-fills the
  amount field with the plan's price, but it stays editable), payment date (defaults to
  today) -> POST /api/payments.
- A table below listing recent payments (member name, plan, amount, start_date, end_date,
  payment_date) from GET /api/payments, with an optional filter by member.
```

---

### Prompt 5 — Check-ins (admin + member)

```
Build check-in features for both roles:

- Admin page /admin/checkins: a searchable member select + "Check in" button ->
  POST /api/checkins with member_id, plus a table of recent check-ins (member name,
  checked_in_at) from GET /api/checkins. Show a clear error message if the API rejects the
  check-in because the member has no active subscription.

- Member page /member/checkin: a single "Check in" button -> POST /api/checkins (no
  member_id needed, the API infers it from the token), plus a list of their own past
  check-ins below it.
```

---

### Prompt 6 — Admin dashboard

```
Build /admin/dashboard showing the stats from GET /api/dashboard as shadcn Card components:
total members, active members, expired members, revenue this month, check-ins today.
Feel free to add small icons or a simple chart if you want — your call.
```

---

### Prompt 7 — Member dashboard

```
Build /member/dashboard for a logged-in member, using GET /api/me/member:
- Their current subscription status (active/expired, plan name, end date).
- A payment history table (amount, plan, start/end dates, payment date).
- A check-in history list.

Keep it read-only and scoped to their own data — the API already enforces this, just build
the UI for it.
```
