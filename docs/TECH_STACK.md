# Tech Stack

## Framework & Language

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 15.1.x | App Router, Server Components, Server Actions, Turbopack dev |
| **React** | 19.0.0 | UI rendering (RC with Server Components support) |
| **TypeScript** | 5.7.x | Strict mode enabled, bundler module resolution |
| **Bun** | 1.3.x | Package manager & runtime |

## Database & Auth

| Technology | Version | Purpose |
|---|---|---|
| **Supabase** | JS SDK 2.48.x | PostgreSQL database, Auth, Realtime, Row Level Security |
| **@supabase/ssr** | 0.5.x | Server-side auth with cookie management |

### Auth Methods (pre-configured)
- **OAuth**: GitHub, Google (via `signInWithOAuth`)
- **Magic Link**: Email OTP (via `signInWithOtp`)
- Auto-creates `users` row via database trigger on `auth.users` insert

### Database Schema (5 tables)
1. **users** — Profile data, billing address, payment method (RLS: own data only)
2. **customers** — Private `user_id → stripe_customer_id` mapping (no RLS policies = admin only)
3. **products** — Synced from Stripe via webhooks (public read)
4. **prices** — Synced from Stripe via webhooks (public read)
5. **subscriptions** — Synced from Stripe via webhooks (RLS: own data only)

### Custom Types
- `pricing_type`: `one_time | recurring`
- `pricing_plan_interval`: `day | week | month | year`
- `subscription_status`: `trialing | active | canceled | incomplete | incomplete_expired | past_due | unpaid | paused`

## Payments

| Technology | Version | Purpose |
|---|---|---|
| **Stripe** (server) | 14.25.x | Subscriptions, Checkout Sessions, Customer management |
| **@stripe/stripe-js** | 2.4.x | Client-side Stripe.js |

### Stripe Integration
- **API Version**: `2023-10-16`
- **Webhook Events**: `product.created/updated`, `price.created/updated`, `checkout.session.completed`, `customer.subscription.created/updated/deleted`
- **Checkout Flow**: Server Action → `stripeAdmin.checkout.sessions.create` → redirect
- **Subscription Management**: Portal redirect via `/manage-subscription` route
- **Fixture file**: `stripe-fixtures.json` for seeding test products

## Email

| Technology | Version | Purpose |
|---|---|---|
| **Resend** | 4.1.x | Transactional email sending |
| **React Email** | 2.1.x | Email template authoring with React components |
| **@react-email/components** | 0.0.32 | Pre-built email components (Body, Button, Container, etc.) |

### Email Features
- Welcome email template (`src/features/emails/welcome.tsx`)
- Tailwind CSS support in emails (separate config)
- Dev preview server: `bun email:dev` on port 3001
- Build & export commands for production templates

## UI Components

| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | 3.4.x | Utility-first CSS |
| **tailwindcss-animate** | 1.0.x | Animation utilities |
| **shadcn/ui (Radix)** | Various | Accessible headless components |
| **Lucide React** | 0.474.x | Icon library |
| **react-icons** | 5.4.x | Additional icons (IoLogo* for social) |
| **class-variance-authority** | 0.7.x | Component variant management |
| **clsx + tailwind-merge** | 2.1.x / 2.6.x | Conditional class composition |

### Installed shadcn/ui Components
- Button, Input, Tabs, Toast/Toaster, Sheet, Collapsible, Dropdown Menu

### Fonts
- **Montserrat** — Primary sans-serif
- **Montserrat Alternates** — Display/heading font (weight 500-700)

### Theme
- HSL CSS variables system (light + dark mode via `.dark` class)
- Dark-first design (root uses dark values)
- Custom `--radius: 0.5rem` border radius token
- Max container width: 1440px

## Development Tools

| Technology | Version | Purpose |
|---|---|---|
| **ESLint** | 8.57.x | Linting (next, prettier, react, tailwindcss, import-sort) |
| **Prettier** | 2.8.x | Code formatting with Tailwind plugin |
| **env-cmd** | 10.1.x | Environment variable management for CLI scripts |
| **Supabase CLI** | 1.226.x | Migrations, type generation, local dev |
| **Vercel Analytics** | 1.4.x | Production analytics |

## Key npm Scripts

```bash
bun dev              # Next.js dev server with Turbopack
bun build            # Production build
bun lint             # ESLint
bun email:dev        # React Email preview (port 3001)
bun email:build      # Build email templates
bun stripe:listen    # Forward Stripe webhooks to localhost
bun generate-types   # Generate Supabase TypeScript types
bun migration:new    # Create new Supabase migration
bun migration:up     # Run migrations + regenerate types
```

## Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_PASSWORD

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

# Email
RESEND_API_KEY

# App
NEXT_PUBLIC_SITE_URL
```
