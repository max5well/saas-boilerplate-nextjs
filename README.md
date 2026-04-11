# SaaS Boilerplate — Next.js + Supabase + Stripe + Resend

A production-ready SaaS starter built on Next.js 15 (App Router), Supabase for auth/database, Stripe for subscriptions, and Resend + React Email for transactional emails.

## What's included

- **Next.js 15** — App Router, Server Actions, Turbopack dev
- **Supabase** — Postgres database, Row-Level Security, user authentication (OAuth + magic link)
- **Stripe** — Checkout, subscriptions, customer portal, webhook sync
- **Resend + React Email** — 7 transactional email templates, typed senders
- **Tailwind CSS + shadcn/ui** — Dark mode, accessible components
- **TypeScript strict mode** — End-to-end type safety with Zod validation
- **Vitest + Testing Library** — Testing infrastructure ready to go
- **GitHub Actions CI** — Lint, typecheck, test, and build on every PR
- **Sentry** — Error monitoring (opt-in, just add your DSN)
- **Rate limiting** — Built-in protection for auth and contact forms

## Quick start

```bash
# 1. Clone and install
git clone <your-repo-url>
cd <your-repo>
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in your Supabase, Stripe, and Resend keys

# 3. Update site config
# Edit src/config/site.ts with your app name, description, and email sender

# 4. Update package.json scripts
# Replace UPDATE_THIS_WITH_YOUR_SUPABASE_PROJECT_ID and
# UPDATE_THIS_WITH_YOUR_STRIPE_PROJECT_NAME with your values

# 5. Set up Stripe products
stripe fixtures ./stripe-fixtures.json --api-key YOUR_SK

# 6. Set up Stripe customer portal (optional)
stripe fixtures ./stripe-portal-config.json --api-key YOUR_SK

# 7. Run database migrations
npm run migration:up

# 8. Start developing
npm run dev
```

## Project structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, signup, password reset
│   ├── (account)/          # Account dashboard, settings
│   ├── admin/              # Admin dashboard (role-protected)
│   ├── api/                # Webhooks, subscription API
│   └── auth/callback/      # OAuth + magic link callback
├── components/             # Shared React components
│   └── ui/                 # shadcn/ui components
├── config/site.ts          # Central app configuration
├── features/               # Feature modules
│   ├── auth/               # Auth actions, config, hooks
│   ├── account/            # Account controllers + actions
│   ├── pricing/            # Stripe products, checkout
│   ├── emails/             # React Email templates
│   └── contact/            # Contact form
├── libs/                   # SDK clients (Supabase, Stripe, Resend)
└── utils/                  # Shared utilities
```

## Key commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm test` | Run tests (Vitest) |
| `npm run lint` | Run ESLint |
| `npm run email:dev` | Preview email templates (port 3001) |
| `npm run stripe:listen` | Forward Stripe webhooks to localhost |
| `npm run migration:up` | Run Supabase migrations |
| `npm run migration:new <name>` | Create a new migration |
| `npm run generate-types` | Regenerate Supabase TypeScript types |

## Database tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `users` | Profile, billing address, payment method, email prefs | Own data only |
| `customers` | User → Stripe customer mapping | Admin only |
| `products` | Stripe products (synced via webhook) | Public read |
| `prices` | Stripe prices with intervals | Public read |
| `subscriptions` | User subscriptions with status | Own data only |

## Authentication

The boilerplate supports three auth methods:

- **OAuth** — Google and GitHub (configure in Supabase Dashboard → Auth → Providers)
- **Magic link** — Passwordless email authentication
- **Password** — Reset and update flows included

Protected routes are configured in `src/features/auth/config/auth-config.ts`. The middleware handles session management and route protection.

## Stripe integration

Products are defined in `stripe-fixtures.json`. Features are stored in Stripe product metadata:

```
features: "5 projects,10 GB storage,Email support"
support_level: "email" | "priority" | "dedicated"
price_card_variant: "basic" | "pro" | "enterprise"
```

The webhook handler at `src/app/api/webhooks/route.ts` syncs products, prices, and subscriptions to Supabase automatically.

## Email templates

7 templates in `src/features/emails/`:

- Welcome, verification, password reset
- Subscription started, updated, canceled
- Payment receipt

Preview them with `npm run email:dev`.

## Deployment

1. Deploy to Vercel (or any Node.js host)
2. Set environment variables from `.env.example`
3. Create a Stripe webhook pointing to `<your-url>/api/webhooks`
4. Run `npm run migration:up` against your production Supabase
5. Run Stripe fixtures with your live API key

## Going live checklist

- [ ] Update `src/config/site.ts` with your production values
- [ ] Activate Stripe live mode and update API keys
- [ ] Create live Stripe webhook
- [ ] Run fixtures with live Stripe key
- [ ] Configure OAuth providers in Supabase
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain
- [ ] (Optional) Add Sentry DSN for error monitoring

## License

MIT
