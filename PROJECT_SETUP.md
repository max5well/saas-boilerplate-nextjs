# Project Setup Guide

Step-by-step instructions for turning this boilerplate into your product. Work through each section in order — later steps depend on earlier ones.

> **Quick alternative:** Run `/onboard-new-saas` in Claude Code to do this interactively. The wizard asks questions and applies everything for you.

---

## 1. Create external accounts

You need three services. All have free tiers.

| Service | What for | Sign up |
|---------|----------|---------|
| **Supabase** | Database + auth | [supabase.com](https://supabase.com) → Create project |
| **Stripe** | Payments | [stripe.com](https://stripe.com) → Create account |
| **Resend** | Email delivery | [resend.com](https://resend.com) → Create account |

### Supabase setup
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API** and copy:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - Anon/public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Service role key (`SUPABASE_SERVICE_ROLE_KEY`)
3. Go to **Project Settings → Database** and reset the database password (fixes a [known CLI bug with special characters](https://github.com/supabase/supabase/issues/15184))

### Stripe setup
1. Create a project at [stripe.com](https://stripe.com)
2. Go to **Developers → API keys** and copy:
   - Publishable key (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
   - Secret key (`STRIPE_SECRET_KEY`)
3. Go to **Settings → Billing → Customer Portal** and click **Activate test link**

### Resend setup
1. Create an account at [resend.com](https://resend.com)
2. Go to **API Keys** and create one (`RESEND_API_KEY`)
3. (Optional) Add the [Supabase Resend integration](https://supabase.com/partners/integrations/resend)

---

## 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in your keys from Step 1. The file is self-documenting — each variable has a comment explaining where to find it.

**Optional variables:**
- `NEXT_PUBLIC_SITE_URL` — set this to your production URL when deploying
- `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` — add for error monitoring ([sentry.io](https://sentry.io))

---

## 3. Update site config

Edit **`src/config/site.ts`** — this is the single source of truth for your app identity:

```typescript
export const siteConfig = {
  name: 'YourApp',                           // ← Your app name
  description: 'What your app does.',        // ← One-liner for meta tags
  url: 'https://yourapp.com',                // ← Production URL
  links: {
    twitter: 'https://twitter.com/you',      // ← or null to hide
    facebook: null,
    instagram: null,
    github: 'https://github.com/you/repo',   // ← or null to hide
  },
  email: {
    from: 'YourApp <noreply@yourapp.com>',   // ← Must match your Resend verified domain
    replyTo: 'support@yourapp.com',          // ← or null
  },
};
```

Everything else reads from this file — landing page, emails, footer, legal pages, meta tags.

---

## 4. Update package.json scripts

Open **`package.json`** and replace two placeholders:

```
UPDATE_THIS_WITH_YOUR_SUPABASE_PROJECT_ID  →  your Supabase project ID (from the URL: xxx.supabase.co)
UPDATE_THIS_WITH_YOUR_STRIPE_PROJECT_NAME  →  your Stripe project name (from dashboard)
```

These appear in the `generate-types`, `supabase:link`, and `stripe:listen` scripts.

---

## 5. Run database migrations

```bash
# Link your local Supabase CLI to your project
npm run supabase:link

# Run all migrations (creates tables, RLS policies, roles, indexes)
npm run migration:up
```

This creates 5 core tables: `users`, `customers`, `products`, `prices`, `subscriptions`.

---

## 6. Seed Stripe products

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe fixtures ./stripe-fixtures.json --api-key sk_test_YOUR_KEY

# Optional: set up customer portal configuration
stripe fixtures ./stripe-portal-config.json --api-key sk_test_YOUR_KEY
```

The webhook handler auto-syncs these products to your Supabase database.

---

## 7. Configure OAuth providers

In **Supabase Dashboard → Authentication → Providers**:

### Google
1. Go to [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Set redirect URI to: `https://YOUR_SUPABASE_URL/auth/v1/callback`
4. Copy Client ID + Secret into Supabase

### GitHub
1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL to: `https://YOUR_SUPABASE_URL/auth/v1/callback`
4. Copy Client ID + Secret into Supabase

**Don't need both?** Remove the unwanted provider's button from `src/app/(auth)/auth-ui.tsx` and its config from `src/features/auth/config/auth-config.ts`.

---

## 8. Set up Stripe webhook

### Local development
```bash
npm run stripe:listen
```
This forwards Stripe events to `localhost:3000/api/webhooks`. Copy the webhook signing secret it prints and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

### Production
1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Add endpoint: `https://yourapp.com/api/webhooks`
3. Select events: **Select all events** (or at minimum: `product.*`, `price.*`, `customer.subscription.*`, `checkout.session.completed`, `invoice.payment_succeeded`)
4. Copy the signing secret → set as `STRIPE_WEBHOOK_SECRET` in your hosting env vars

---

## 9. Replace branding assets

| File | What | Size |
|------|------|------|
| `public/logo.png` | App logo (header, auth screens) | 80x80px recommended |
| `public/hero-shape.png` | Hero section background | 1440px wide |
| `public/section-bg.png` | Pricing section background | 1440px wide |
| `public/favicon.ico` | Browser tab icon | 32x32px |

---

## 10. Customize your pricing

Edit **`stripe-fixtures.json`** to change plans, prices, and features. Then re-run:
```bash
# Delete old test data first in Stripe Dashboard → Developers → Delete test data
stripe fixtures ./stripe-fixtures.json --api-key sk_test_YOUR_KEY
```

Product features are stored as Stripe metadata. The Zod schema at `src/features/pricing/models/product-metadata.ts` validates them. If you add new metadata fields, update the schema.

---

## 11. Start developing

```bash
npm run dev
```

### Test the full flow
1. Go to `localhost:3000` and click **Get started for free**
2. Click **Continue with Email** and enter your email
3. Click the magic link in your email → you're authenticated
4. Click **Get Started** on a plan → Stripe checkout (test mode)
5. Use card number `4242 4242 4242 4242` with any future date and CVC
6. You're redirected to `/account` with your active subscription
7. Click **Manage your subscription** → Stripe customer portal

---

## What to customize next

After the basic setup, here's what you'll typically change:

### Must do
- [ ] Add your product's core data model (see "Adding new tables" below)
- [ ] Build your main authenticated experience (what users do after signup)
- [ ] Replace landing page copy in `src/app/page.tsx`
- [ ] Replace placeholder legal text in `/privacy`, `/terms`, `/about-us`
- [ ] Set up a custom email domain in Resend (required for production email delivery)

### Should do
- [ ] Add feature gating (check subscription tier before allowing actions)
- [ ] Update email templates in `src/features/emails/` with your copy and branding
- [ ] Update `globals.css` color variables if you want a different accent color
- [ ] Set `NEXT_PUBLIC_SITE_URL` for production deployment
- [ ] Add your Sentry DSN for error monitoring

### Nice to have
- [ ] Add tests for your business logic in `src/**/*.test.ts`
- [ ] Customize the admin dashboard at `/admin`
- [ ] Add more shadcn/ui components: `npx shadcn-ui@latest add [component]`

---

## Adding new tables

1. Create a migration:
```bash
npm run migration:new add-your-table
```

2. Write the SQL:
```sql
create table your_table (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table your_table enable row level security;

create policy "Users can CRUD own data."
  on your_table for all
  using (auth.uid() = user_id);
```

3. Run it:
```bash
npm run migration:up
```

4. Create a feature module:
```
src/features/your-feature/
├── actions/your-feature-actions.ts   # Server Actions
├── components/your-feature-list.tsx  # UI components
├── controllers/get-your-features.ts  # Data fetching
└── types.ts                          # Types + Zod schemas
```

5. Add the route to `protectedRoutes` in `src/features/auth/config/auth-config.ts`

6. Create pages in `src/app/(account)/your-feature/page.tsx`

---

## Deployment

### Vercel (recommended)
1. Push to GitHub
2. Import in Vercel
3. Add all env vars from `.env.local`
4. Deploy

### Other platforms
The app is a standard Next.js app. It works on any platform that supports Next.js:
- `npm run build` → `npm start`
- Ensure all env vars are set
- Set `NEXT_PUBLIC_SITE_URL` to your production URL

### Post-deployment
1. Create a **production** Stripe webhook pointing to `https://yourdomain.com/api/webhooks`
2. Run Stripe fixtures with your **live** API key
3. Verify the webhook is receiving events in Stripe Dashboard

---

## Production notes

### What's production-ready out of the box
- Auth (OAuth + magic link + password reset) with middleware route protection
- Stripe integration (checkout, webhooks, customer portal, subscription sync)
- Email delivery (7 templates, Resend integration)
- Database schema with Row-Level Security on all tables
- Error boundaries (route-level + global)
- SEO (robots.txt, sitemap, OG tags)
- CI pipeline (lint, typecheck, test, build)

### What you should address before going live

**Rate limiting** — The built-in rate limiter is in-memory, which works for single-server deployments but resets on each serverless function invocation (Vercel). For production at scale, swap `src/libs/rate-limit/rate-limiter.ts` with Redis-backed rate limiting:
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Webhook idempotency** — Stripe delivers webhooks at-least-once. The subscription upsert is idempotent, but emails will send on every delivery. If duplicate emails are a concern, add event ID tracking (store processed event IDs in a Supabase table and skip duplicates).

**Error monitoring** — Sentry config files are included but minimal. Add `Sentry.captureException(error)` in your webhook handler and server actions to get real-time alerts.

**Email domain** — Resend requires a verified sending domain for production. The default `noreply@myapp.com` won't work — you need to verify your domain at [resend.com/domains](https://resend.com/domains).

**Supabase types** — The generated types in `src/libs/supabase/types.ts` are manually maintained. After modifying the database, regenerate with `npm run generate-types`. The `as unknown as` casts in some controllers are workarounds for Supabase's type inference; they're safe as long as your types match the actual schema.

---

## Architecture reference

```
src/
├── app/                          # Pages (App Router)
│   ├── (auth)/                   # Login, signup, password reset
│   ├── (account)/                # Dashboard, settings (auth required)
│   ├── admin/                    # Admin dashboard (admin role required)
│   ├── api/webhooks/             # Stripe webhook handler
│   ├── api/subscription/         # Subscription status API
│   └── auth/callback/            # OAuth + magic link callback
├── components/ui/                # shadcn/ui components
├── config/site.ts                # App identity (single source of truth)
├── features/                     # Business logic modules
│   ├── auth/                     # Auth actions, config, hooks
│   ├── account/                  # Account controllers + actions
│   ├── pricing/                  # Products, checkout, pricing cards
│   ├── emails/                   # 7 email templates + sender
│   └── contact/                  # Contact form
├── libs/                         # SDK clients (lazy-initialized)
│   ├── supabase/                 # Server, admin, middleware clients + types
│   ├── stripe/                   # Stripe admin client
│   ├── resend/                   # Resend email client
│   └── rate-limit/               # In-memory rate limiter
└── utils/                        # Shared utilities
```

### Key conventions
- **Server components by default**, `'use client'` only for interactivity
- **Server Actions** for mutations (form submissions, data writes)
- **Controllers** for data fetching (called from server components)
- **Stripe is source of truth** for products/prices — synced via webhooks
- **RLS everywhere** — every user-facing table has row-level security
- **Central config** — `src/config/site.ts` drives all branding
