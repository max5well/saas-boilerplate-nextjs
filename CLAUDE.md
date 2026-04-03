# SaaS Boilerplate — Next.js + Supabase + Stripe + Resend

## What this is

A production-ready SaaS starter built on Next.js 15 (App Router), Supabase for auth/database, Stripe for subscriptions, and Resend + React Email for transactional emails. Clone it, update the config, and start building your product.

## Quick start for a new project

1. Copy `.env.example` → `.env.local` and fill in your keys
2. Update `src/config/site.ts` with your app name, description, URLs, and email sender
3. Update `package.json` scripts with your Supabase project ID and Stripe project name
4. Run Stripe fixtures: `stripe fixtures ./stripe-fixtures.json --api-key YOUR_SK`
5. Run Supabase migrations: `npm run migration:up`
6. `npm run dev`

## Architecture

- **App Router** with route groups: `(auth)` for login/signup, `(account)` for user dashboard
- **Server-first**: `force-dynamic` root layout, Server Actions for mutations, no client-side API routes
- **Feature modules**: `src/features/<feature>/` with `actions/`, `components/`, `controllers/` pattern
- **Stripe as source of truth**: Products and prices managed in Stripe Dashboard, synced to Supabase via webhooks
- **Row-level security**: All user-facing tables have RLS policies enforced at the database layer

## Key files

- `src/config/site.ts` — Central config (app name, description, email sender, links)
- `src/app/api/webhooks/route.ts` — Stripe webhook handler (9 event types)
- `src/features/pricing/models/product-metadata.ts` — Zod schema for Stripe product metadata
- `src/features/emails/utils/email-sender.ts` — Email sending with typed convenience wrappers
- `stripe-fixtures.json` — Seed data for Stripe products/prices
- `supabase/migrations/` — Database schema (users, products, prices, subscriptions, customers)

## Conventions

- TypeScript strict mode, Zod for validation at boundaries
- Tailwind CSS with shadcn/ui components in `src/components/ui/`
- Imports use `@/` path alias (maps to `src/`)
- Server components by default; `'use client'` only where needed
- Dark theme default via `next-themes`

## Database tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `users` | Profile, billing address, payment method | Own data only |
| `customers` | User → Stripe customer mapping | Admin only |
| `products` | Stripe products (synced via webhook) | Public read |
| `prices` | Stripe prices with intervals | Public read |
| `subscriptions` | User subscriptions with status | Own data only |

## Adding Stripe product features

Product features are defined in Stripe product metadata as a comma-separated `features` field:
```
features: "5 projects,10 GB storage,Email support"
support_level: "email" | "priority" | "dedicated"
price_card_variant: "basic" | "pro" | "enterprise"
```

Update the Zod schema in `product-metadata.ts` if you need additional metadata fields.
