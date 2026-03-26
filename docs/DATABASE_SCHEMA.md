# Database Schema

## Schema Diagram

```
auth.users (Supabase managed)
    │
    ├──── 1:1 ──── users (profile, preferences, billing)
    │                 RLS: own data only; admins see all
    │
    ├──── 1:1 ──── customers (Stripe mapping)
    │                 No RLS (service role only)
    │
    ├──── 1:N ──── subscriptions
    │  │              RLS: own data; admins see all
    │  │
    │  └── N:1 ──── prices ──── N:1 ──── products
    │                 Public read                Public read
    │
    ├──── 1:N ──── usage_logs
    │                 RLS: own data; admins see all
    │
    ├──── 1:N ──── audit_logs
    │                 RLS: admins only
    │
    ├──── 1:N ──── organizations (as owner)
    │                 RLS: members see own orgs
    │
    └──── N:M ──── organization_members
                     RLS: members see own org's members
```

## Tables

### users
Extended user profile with preferences and metadata.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | References auth.users |
| full_name | text | From auth provider |
| avatar_url | text | From auth provider |
| role | user_role (enum) | 'user' or 'admin', default 'user' |
| bio | text | User bio |
| company | text | Company name |
| website | text | Personal/company website |
| timezone | text | Default 'UTC' |
| preferences | jsonb | `{theme, language, notifications}` |
| metadata | jsonb | Custom extensible fields |
| billing_address | jsonb | Billing info |
| payment_method | jsonb | Payment instruments |
| created_at | timestamptz | Auto-set |
| updated_at | timestamptz | Auto-updated via trigger |

**RLS Policies:**
- Users can SELECT and UPDATE own row
- Admins can SELECT all rows
- Trigger prevents non-service-role from changing `role`

### customers
Private Stripe customer mapping.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | References auth.users |
| stripe_customer_id | text | Stripe customer ID |

**RLS:** No policies — service role only.

### products
Synced from Stripe via webhooks.

| Column | Type | Notes |
|--------|------|-------|
| id | text (PK) | Stripe product ID |
| active | boolean | Available for purchase |
| name | text | Display name |
| description | text | Product description |
| image | text | Image URL |
| metadata | jsonb | Stripe metadata |

**RLS:** Public read-only.

### prices
Synced from Stripe via webhooks.

| Column | Type | Notes |
|--------|------|-------|
| id | text (PK) | Stripe price ID |
| product_id | text (FK) | References products |
| active | boolean | Available for use |
| description | text | Brief description |
| unit_amount | bigint | Amount in smallest currency unit |
| currency | text | 3-letter ISO code |
| type | pricing_type | 'one_time' or 'recurring' |
| interval | pricing_plan_interval | day/week/month/year |
| interval_count | integer | Billing frequency multiplier |
| trial_period_days | integer | Default trial days |
| metadata | jsonb | Stripe metadata |

**RLS:** Public read-only.

### subscriptions
Synced from Stripe via webhooks.

| Column | Type | Notes |
|--------|------|-------|
| id | text (PK) | Stripe subscription ID |
| user_id | uuid (FK) | References auth.users |
| status | subscription_status | trialing/active/canceled/etc. |
| price_id | text (FK) | References prices |
| quantity | integer | Seat count |
| cancel_at_period_end | boolean | Pending cancellation |
| created | timestamptz | Creation time |
| current_period_start | timestamptz | Current billing period start |
| current_period_end | timestamptz | Current billing period end |
| ended_at | timestamptz | When subscription ended |
| cancel_at | timestamptz | Scheduled cancellation |
| canceled_at | timestamptz | When cancellation was requested |
| trial_start | timestamptz | Trial start |
| trial_end | timestamptz | Trial end |
| metadata | jsonb | Stripe metadata |

**RLS:** Users see own subscriptions; admins see all.

### usage_logs
Tracks metered resource consumption.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| user_id | uuid (FK) | References auth.users |
| resource_type | text | e.g. 'api_calls', 'storage' |
| quantity | integer | Amount consumed, default 1 |
| metadata | jsonb | Additional context |
| created_at | timestamptz | When usage occurred |

**Indexes:** user_id, resource_type, created_at, composite (user_id, resource_type, created_at)

**RLS:** Users see own logs; admins see all; insert via service role.

### organizations
Multi-tenant team/org support.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| name | text | Organization name |
| slug | text (UNIQUE) | URL-friendly identifier |
| owner_id | uuid (FK) | References auth.users |
| settings | jsonb | Org-level settings |
| created_at | timestamptz | When created |

**RLS:** Members can view; owners/admins can update; owners can delete; authenticated users can create.

### organization_members
Junction table for org membership.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| organization_id | uuid (FK) | References organizations (CASCADE) |
| user_id | uuid (FK) | References auth.users |
| role | organization_role | 'owner', 'admin', or 'member' |
| invited_by | uuid (FK) | References auth.users |
| joined_at | timestamptz | When joined |

**Unique constraint:** (organization_id, user_id)

**RLS:** Members see their org's members; owners/admins manage membership; members can leave.

### audit_logs
Security and compliance event logging.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| user_id | uuid (FK) | References auth.users |
| action | text | e.g. 'user.login', 'subscription.created' |
| resource_type | text | e.g. 'user', 'subscription' |
| resource_id | uuid | ID of affected resource |
| metadata | jsonb | Additional context |
| ip_address | inet | Client IP |
| user_agent | text | Client user agent |
| created_at | timestamptz | When event occurred |

**Indexes:** user_id, action, (resource_type, resource_id), created_at

**RLS:** Admins only; insert via service role.

## Helper Functions

### `get_user_usage(user_id, resource_type, start_date, end_date)`
Returns total usage quantity for a user/resource within a date range.

### `check_usage_limit(user_id, resource_type, limit)`
Returns `true` if the user is under the limit for the current month.

### `get_user_subscription_status(user_id)`
Returns the active/trialing subscription with product details.

### `create_audit_log(...)`
Inserts an audit log entry. Called from server-side code.

### `is_admin()`
Returns `true` if the current user has the 'admin' role.

## Triggers

| Trigger | Table | Purpose |
|---------|-------|---------|
| on_auth_user_created | auth.users | Auto-create public.users profile |
| on_user_updated | users | Auto-set updated_at |
| on_user_role_change | users | Prevent non-service-role role changes |
| on_organization_created | organizations | Auto-add owner as member |

## Enums

- `user_role`: 'user', 'admin'
- `organization_role`: 'owner', 'admin', 'member'
- `pricing_type`: 'one_time', 'recurring'
- `pricing_plan_interval`: 'day', 'week', 'month', 'year'
- `subscription_status`: 'trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused'
