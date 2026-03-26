# Adaptation Plan

## Already Implemented

### Core Infrastructure
- [x] Next.js 15 App Router with Turbopack
- [x] TypeScript strict mode
- [x] Supabase PostgreSQL with Row Level Security
- [x] Supabase Auth (OAuth: GitHub + Google, Magic Link)
- [x] Auth callback with session exchange
- [x] Middleware for session refresh
- [x] Path alias (`@/*` → `./src/*`)

### Payments
- [x] Stripe integration (server SDK + client Stripe.js)
- [x] Webhook handler for product/price/subscription sync
- [x] Checkout session creation via Server Action
- [x] Subscription management portal redirect
- [x] Customer creation + Supabase mapping
- [x] Billing details sync to customer profile
- [x] Stripe fixtures file for test data seeding

### UI
- [x] Tailwind CSS with HSL CSS variable theming
- [x] shadcn/ui components (Button, Input, Tabs, Toast, Sheet, Collapsible, Dropdown)
- [x] Responsive navigation (desktop + mobile sheet)
- [x] Pricing page with price cards
- [x] Account page
- [x] Landing page with footer
- [x] Toast notification system

### Email
- [x] Resend client setup
- [x] React Email welcome template
- [x] Email dev preview server (port 3001)

### Dev Tooling
- [x] ESLint (next + prettier + react + tailwind + import-sort)
- [x] Prettier with Tailwind plugin
- [x] Supabase CLI for migrations + type generation
- [x] Stripe CLI webhook forwarding script
- [x] Vercel Analytics integration
- [x] `.env.local.example` with all required vars documented

---

## To Implement

### P0 — Foundation (Do First)

- [ ] **Dark Mode Toggle** — CSS variables exist but no toggle UI. Add `next-themes` provider + toggle component in nav.
- [ ] **Loading States & Skeletons** — No loading.tsx files exist anywhere. Add skeleton loaders for pricing, account, and auth pages.
- [ ] **Error Boundaries** — No error.tsx or not-found.tsx files. Add per-route error handling with user-friendly fallback UI.
- [ ] **Environment Validation** — Replace runtime `getEnvVar` throws with Zod schema validation at build/startup time (`src/env.ts`).
- [ ] **Welcome Email Auto-Send** — Template exists but isn't wired up. Trigger via Supabase webhook or auth callback on first login.

### P1 — Auth & User Management

- [ ] **OAuth Provider Setup Guide** — Document Supabase dashboard configuration for GitHub + Google providers (redirect URLs, client IDs).
- [ ] **User Roles System** — Add `role` column to `users` table (`user | admin`). Create middleware guard for admin routes. Add RLS policies per role.
- [ ] **Profile Page Enhancement** — Current account page is minimal. Add avatar upload (Supabase Storage), display name edit, email preferences.
- [ ] **Account Deletion** — GDPR requirement. Server Action to delete user data across Supabase + cancel Stripe subscription + delete Stripe customer.

### P2 — UI & UX Polish

- [ ] **Additional shadcn/ui Components** — Install: Avatar, Badge, Card, Dialog, Select, Separator, Skeleton, Switch, Table, Tooltip.
- [ ] **Dashboard Layout** — Post-login layout with sidebar navigation (for SaaS app pages). Separate from marketing layout.
- [ ] **Empty States** — Icon + description + CTA for every list view (no subscriptions, no data, etc.).
- [ ] **Responsive Improvements** — Footer grid breaks on small screens. Pricing cards need mobile stack. Test all breakpoints.
- [ ] **Page Transitions** — Subtle fade-in animations on route changes using `next/navigation` events.

### P3 — Email System

- [ ] **Additional Email Templates** — Password reset, subscription confirmation, payment failed, trial ending, cancellation confirmation.
- [ ] **Email Preferences** — User-configurable email opt-in/out per category. Store in users table.
- [ ] **Email Trigger System** — Map Stripe webhook events to email sends (e.g., `customer.subscription.deleted` → cancellation email).

### P4 — Database & API

- [ ] **Extended Database Schema** — Add tables for app-specific data. Create migration template with RLS policies.
- [ ] **API Rate Limiting** — Add rate limiting middleware for webhook endpoint and any future API routes.
- [ ] **Database Seed Script** — Enhance `supabase/seed.sql` with test users, products, and subscriptions for local development.
- [ ] **Type Safety** — Run `generate-types` in CI. Add generated types to `.gitignore` or commit them with freshness check.

### P5 — DevOps & Quality

- [ ] **CI/CD Pipeline** — GitHub Actions: lint → type-check → build → (test). Deploy preview on PR, production on main merge.
- [ ] **Pre-commit Hooks** — Husky + lint-staged: ESLint + Prettier on staged files. Prevent commits with type errors.
- [ ] **Testing Setup** — Install Vitest for unit/integration tests. Add test for webhook handler, auth actions, and checkout flow.
- [ ] **E2E Testing** — Playwright setup for critical paths: signup → subscribe → access app → manage subscription.
- [ ] **Docker Compose** — Local dev with Supabase local, Stripe mock, and the Next.js app.

### P6 — Production Readiness

- [ ] **SEO & Metadata** — Update root metadata. Add per-page metadata. OG images. Sitemap. Robots.txt.
- [ ] **Legal Pages** — Privacy policy, Terms of service, Cookie policy (as MDX pages).
- [ ] **Cookie Consent** — Banner component with granular category selection. Gate analytics behind consent.
- [ ] **Monitoring** — Error tracking (Sentry). Uptime monitoring. Stripe webhook failure alerts.
- [ ] **Security Headers** — CSP, HSTS, X-Frame-Options via `next.config.js` headers.
- [ ] **Admin Panel Foundation** — Protected `/admin` routes. User management table. Subscription overview. Revenue metrics.

---

## Priority Order (Implementation Sequence)

| Phase | Items | Rationale |
|---|---|---|
| **1. Foundation** | Dark mode, loading states, error boundaries, env validation | Baseline UX quality every SaaS needs |
| **2. Auth & Roles** | Role system, profile page, account deletion | Multi-tenant SaaS requires roles early |
| **3. UI Components** | Additional shadcn, dashboard layout, empty states | Build on component library before features |
| **4. Email System** | Templates, triggers, preferences | Critical for user engagement |
| **5. DevOps** | CI/CD, pre-commit, testing setup | Quality gates before feature velocity |
| **6. Production** | SEO, legal, consent, monitoring, admin | Required before launch |
