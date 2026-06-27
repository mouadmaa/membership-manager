# Membership Manager — Presentation Script

**Duration:** ~4–6 minutes  
**Language:** English  
**App:** MemberShip (admin dashboard + member portal)

---

## Before you start — demo checklist

- [ ] MySQL running: `docker compose up -d` (repo root)
- [ ] API running: `php artisan serve` (from `server/`)
- [ ] Client running: `npm run dev` (from `client/`)
- [ ] Browser open at http://localhost:5173
- [ ] Logged in as **admin@example.com** / **password**
- [ ] Start on **Admin → Dashboard** (`/admin/dashboard`)

**Demo member (create in Part 4):**

| Field | Value |
| ----- | ----- |
| Name | Demo Member |
| Email | demo@example.com |
| Password | password |
| National ID | NAT999999 |
| Phone | 0600000000 |

**Demo plan (create in Part 3, then delete):**

| Field | Value |
| ----- | ----- |
| Name | Demo Monthly |
| Price | 150 |
| Duration | 30 days |

For Part 5 payment, use an **existing seeded plan** (e.g. Monthly) so the member stays active after you delete the demo plan.

---

## Part 1 – Introduction

**Speech:**

Good morning. Today I will present **MemberShip**, a membership management system.

It can be used for any business that works with members — like a gym, a club, or a library.

The app has two roles. The **admin** manages plans, members, payments, and check-ins. The **member** sees their own subscription and can check in by themselves.

It is built with a **React** frontend, a **Laravel** API, and a **MySQL** database.

I will start from the admin dashboard, then show the member side at the end.

---

## Part 2 – Admin Dashboard

**Speech:**

This is the admin dashboard. It gives a quick overview of the system.

Here we see the **total members**, how many are **active**, and how many are **expired** — based on their latest subscription.

This chart shows **revenue over the last six months**, so the admin can follow income over time.

Now I will go through the main management pages one by one.

---

## Part 3 – Plans Management

**Speech:**

This page is for **membership plans**. Each plan has a name, a price in dirhams, and a duration in days.

Admins can create, edit, and delete plans from here.

Now I will create a new plan.

*Click **Add plan** → enter Demo Monthly, 150 DH, 30 days → Save.*

I will update the price to show that edit works.

*Click **Edit** → change price to 160 → Save.*

And now I will delete it.

*Click **Delete** → confirm.*

Next, I will manage members.

---

## Part 4 – Members Management

**Speech:**

On this page, the admin manages **members** — their name, email, national ID, and phone.

We can search members and filter by active or expired status.

Now I will create a member for our demo.

*Click **Add member** → enter Demo Member, demo@example.com, password, NAT999999, phone → Save.*

I will open the member details to show the full profile.

*Click the row → detail drawer opens.*

Here we see their **subscriptions**, **payments**, and **check-ins**. Right now this member is new, so most of this is empty.

Let us record a payment to activate their subscription.

---

## Part 5 – Payments Management

**Speech:**

The payments page is where the admin **records a payment**.

When we save a payment, the system **automatically creates or extends a subscription** for that member. We do not manage subscriptions in a separate page.

Now I will enter the payment information for Demo Member.

*Select Demo Member → select a plan (e.g. Monthly) → amount fills from the plan → Save.*

This payment makes the member's subscription **active**.

Next, I will check this member in from the admin side.

---

## Part 6 – Admin Check-ins

**Speech:**

Check-ins track when a member visits the facility.

On this page, the admin can **check in any member** — for example at the front desk.

A member can only check in if they have an **active subscription**. We just paid for Demo Member, so this should work.

Now I will check in Demo Member.

*Select Demo Member → click **Check in**.*

The check-in appears in the list below.

Now I will switch to the **member** role and show what Demo Member sees.

---

## Part 7 – Member Login

**Speech:**

I will log out from the admin account.

*Open profile menu → **Logout**.*

This is the login page. Members and admins use the same login, but they see different menus after signing in.

Now I will log in as the member we created.

*Enter demo@example.com and password → Login.*

We are redirected to the **member dashboard**. The sidebar is simpler — only Dashboard and Check in.

---

## Part 8 – Member Dashboard

**Speech:**

This is the member dashboard. It is **read-only** — members cannot manage other people here.

At the top we see the **current subscription**: active or expired, the plan name, and the end date.

Below that is **payment history** — what the member has paid.

And here is the **check-in history**, including the check-in we did from the admin page.

Let me show the member check-in page.

---

## Part 9 – Member Check-in

**Speech:**

On this page, the member can **check in by themselves** when they arrive.

They click one button — no need to select a member. The system uses their own account.

They need an **active subscription** to check in. Demo Member is active, so this will work.

*Click **Check in**.*

The new check-in shows up in the list below.

That covers both the admin and member flows.

---

## Part 10 – Conclusion

**Speech:**

To sum up, **MemberShip** is a simple system for managing memberships.

The admin handles plans, members, payments, and check-ins. The member views their subscription and can check in on their own.

Everything we showed is connected — a payment activates a subscription, and an active subscription allows check-ins.

Thank you for your attention. I am happy to answer any questions.

---

## Quick timing guide

| Part | Topic | ~Seconds |
| ---- | ----- | -------- |
| 1 | Introduction | 35–45 |
| 2 | Admin dashboard | 25–35 |
| 3 | Plans CRUD | 40–50 |
| 4 | Members + drawer | 45–55 |
| 5 | Payments | 35–45 |
| 6 | Admin check-ins | 30–40 |
| 7 | Member login | 20–30 |
| 8 | Member dashboard | 25–35 |
| 9 | Member check-in | 20–30 |
| 10 | Conclusion | 20–30 |

**Tip:** Speak the short lines first, then do the clicks. Pause briefly after each successful action so the teacher can follow.
