# Architecture

## Project Structure Overview

```
src/
├── app/                          # Next.js App Router
│   ├── (account)/                # Route group: authenticated user pages
│   │   ├── account/page.tsx      # Account/profile page
│   │   └── manage-subscription/route.ts  # Stripe portal redirect
│   ├── (auth)/                   # Route group: authentication
│   │   ├── auth-actions.ts       # Server Actions: signIn (OAuth, Email), signOut
│   │   ├── auth-ui.tsx           # Client component: auth form UI
│   │   ├── auth/callback/route.ts # OAuth callback handler
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── api/
│   │   └── webhooks/route.ts     # Stripe webhook handler
│   ├── pricing/page.tsx          # Public pricing page
│   ├── layout.tsx                # Root layout (AppBar + Footer)
│   ├── navigation.tsx            # Server component: nav with auth state
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── account-menu.tsx          # User dropdown menu
│   ├── container.tsx             # Layout wrapper
│   ├── logo.tsx                  # App logo
│   └── sexy-boarder.tsx          # Decorative gradient border
├── features/                     # Feature-based modules
│   ├── account/controllers/      # Account business logic
│   │   ├── get-customer-id.ts
│   │   ├── get-or-create-customer.ts
│   │   ├── get-session.ts
│   │   ├── get-subscription.ts
│   │   ├── get-user.ts
│   │   └── upsert-user-subscription.ts
│   ├── emails/
│   │   ├── welcome.tsx           # Welcome email (React Email)
│   │   └── tailwind.config.ts    # Email-specific Tailwind config
│   └── pricing/
│       ├── actions/              # Server Actions
│       │   └── create-checkout-action.ts
│       ├── components/           # Feature-specific UI
│       │   ├── price-card.tsx
│       │   └── pricing-section.tsx
│       ├── controllers/          # Business logic
│       │   ├── get-products.ts
│       │   ├── upsert-price.ts
│       │   └── upsert-product.ts
│       ├── models/
│       │   └── product-metadata.ts
│       └── types.ts
├── libs/                         # Third-party SDK wrappers
│   ├── resend/resend-client.ts
│   ├── stripe/stripe-admin.ts
│   └── supabase/
│       ├── supabase-admin.ts           # Service role client (webhooks, admin ops)
│       ├── supabase-middleware-client.ts # Session refresh in middleware
│       ├── supabase-server-client.ts   # Cookie-based server client
│       └── types.ts                    # Generated DB types
├── middleware.ts                  # Supabase session refresh on every request
├── styles/globals.css             # Tailwind + CSS variable theme
├── types/action-response.ts       # Shared ActionResponse type
└── utils/
    ├── cn.ts                      # clsx + tailwind-merge
    ├── get-env-var.ts             # Type-safe env access
    ├── get-url.ts                 # Site URL helper (Vercel-aware)
    └── to-date-time.ts            # Unix timestamp → Date
```

## Architecture Pattern

**Feature-based modular architecture** with three layers per feature:

```
feature/
├── actions/       # Next.js Server Actions (entry points from UI)
├── components/    # Feature-specific React components
├── controllers/   # Business logic (called by actions and webhooks)
├── models/        # Type definitions, Zod schemas, metadata
└── types.ts       # Shared types for the feature
```

Cross-cutting concerns live in `libs/` (SDK clients) and `utils/` (pure functions).

## Data Flows

### 1. Stripe → Webhook → Supabase (Product/Price Sync)

```
Stripe Dashboard (create product/price)
  → Stripe fires webhook event
  → POST /api/webhooks
  → Verify signature (stripeAdmin.webhooks.constructEvent)
  → Switch on event type:
      product.created/updated → upsertProduct() → supabaseAdmin.from('products').upsert()
      price.created/updated   → upsertPrice()   → supabaseAdmin.from('prices').upsert()
```

### 2. Checkout → Subscription Flow

```
User clicks "Subscribe" on PricingSection
  → createCheckoutAction (Server Action)
  → getSession() → verify logged in
  → getOrCreateCustomer() → find/create Stripe customer, store in customers table
  → stripeAdmin.checkout.sessions.create()
  → Redirect to Stripe Checkout
  → User completes payment
  → Stripe fires checkout.session.completed webhook
  → upsertUserSubscription() → store in subscriptions table
  → Stripe fires customer.subscription.created webhook
  → upsertUserSubscription() → update subscriptions table
  → User redirected to /account (success_url)
```

### 3. Auth Flow

```
OAuth (GitHub/Google):
  signInWithOAuth(provider)
  → supabase.auth.signInWithOAuth({ redirectTo: /auth/callback })
  → User authenticates with provider
  → Redirect to /auth/callback
  → exchangeCodeForSession(code)
  → DB trigger: on_auth_user_created → insert into public.users
  → Check subscription status
  → Redirect to / (subscribed) or /pricing (no subscription)

Magic Link (Email):
  signInWithEmail(email)
  → supabase.auth.signInWithOtp({ emailRedirectTo: /auth/callback })
  → User clicks link in email
  → Same callback flow as OAuth above
```

### 4. Session Management

```
Every request:
  → middleware.ts intercepts
  → updateSession(request) via supabase-middleware-client
  → Refreshes auth token in cookies
  → Request continues to route handler/page
```

### 5. Email Flow

```
User signs up
  → (Currently manual trigger — no auto-send wired up)
  → Resend API sends email
  → React Email template rendered server-side
  → HTML email delivered
```

## Database Schema (ER Diagram)

```
auth.users (Supabase managed)
    │
    ├──── 1:1 ──── users (profile data, billing)
    │                 RLS: own data only
    │
    ├──── 1:1 ──── customers (Stripe mapping)
    │                 No RLS (admin only via service role)
    │
    └──── 1:N ──── subscriptions
                      │  RLS: own data only
                      │
                      └── N:1 ── prices
                                   │  Public read
                                   │
                                   └── N:1 ── products
                                                 Public read

Realtime enabled: products, prices
```

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/webhooks` | POST | Stripe webhook receiver |
| `/auth/callback` | GET | OAuth/magic link callback |
| `/manage-subscription` | GET | Redirect to Stripe Customer Portal |

## Key Architectural Decisions

1. **Server-first**: Navigation, layouts, and data fetching are Server Components. `'use client'` only for interactive elements (auth-ui, account-menu).
2. **Two Supabase clients**: Anon client (with RLS, cookie-based) for user-facing queries. Service role client (admin, bypasses RLS) for webhooks and server-side mutations.
3. **No API routes for app logic**: Server Actions handle all user-initiated mutations. Only `/api/webhooks` exists for external integrations.
4. **Stripe as source of truth**: Products, prices, and subscriptions are created in Stripe and synced to Supabase via webhooks. The app never creates these directly in the database.
5. **`force-dynamic` on root layout**: Disables static generation to ensure fresh auth state on every page load.
