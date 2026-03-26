# Database Schema

## Schema Diagram

```
auth.users (Supabase managed)
    │
    ├──── 1:1 ──── users (profile, preferences, role)
    │                 RLS: own data + org members can view + admins see all
    │
    ├──── 1:1 ──── customers (Stripe mapping)
    │                 No RLS (service role only)
    │
    ├──── 1:N ──── subscriptions
    │    │           RLS: own data + admins see all
    │    │
    │    └── N:1 ── prices ── N:1 ── products
    │                 Public read          Public read
    │
    ├──── 1:N ──── usage_logs
    │                 RLS: own data + admins see all
    │
    ├──── 1:N ──── organizations (as owner)
    │                 RLS: members can view, owners/admins manage
    │
    ├──── N:M ──── organization_members (join table)
    │                 RLS: org members can view, owners/admins manage
    │
    └──── 1:N ──── audit_logs
                     RLS: admins only

Realtime enabled: products, prices
```

## Tables

### users
Extended profile for each authenticated user. Created automatically via trigger on `auth.users` insert.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | References auth.users |
| full_name | text | Display name |
| avatar_url | text | Profile image URL |
| billing_address | jsonb | Billing address from Stripe |
| payment_method | jsonb | Payment instrument info |
| role | user_role (enum) | 'user' or 'admin' |
| bio | text | User bio |
| company | text | Company name |
| website | text | Personal/company website |
| timezone | text | IANA timezone (default 'UTC') |
| preferences | jsonb | Theme, language, notification settings |
| metadata | jsonb | Custom extensible fields |
| created_at | timestamptz | Account creation time |
| updated_at | timestamptz | Auto-updated on changes |

### customers
Private mapping of user IDs to Stripe customer IDs. No RLS — accessed only via service role.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | References auth.users |
| stripe_customer_id | text | Stripe customer ID |

### products
Synced from Stripe via webhooks. Public read access.

| Column | Type | Description |
|--------|------|-------------|
| id | text (PK) | Stripe product ID |
| active | boolean | Available for purchase |
| name | text | Product name |
| description | text | Product description |
| image | text | Product image URL |
| metadata | jsonb | Stripe metadata |

### prices
Synced from Stripe via webhooks. Public read access.

| Column | Type | Description |
|--------|------|-------------|
| id | text (PK) | Stripe price ID |
| product_id | text (FK) | References products |
| active | boolean | Available for purchase |
| description | text | Price description |
| unit_amount | bigint | Amount in smallest currency unit |
| currency | text | 3-letter ISO code |
| type | pricing_type | 'one_time' or 'recurring' |
| interval | pricing_plan_interval | day/week/month/year |
| interval_count | integer | Billing frequency multiplier |
| trial_period_days | integer | Default trial days |
| metadata | jsonb | Stripe metadata |

### subscriptions
Synced from Stripe via webhooks. Users see own subscriptions.

| Column | Type | Description |
|--------|------|-------------|
| id | text (PK) | Stripe subscription ID |
| user_id | uuid (FK) | References auth.users |
| status | subscription_status | trialing, active, canceled, etc. |
| price_id | text (FK) | References prices |
| quantity | integer | Seat count |
| cancel_at_period_end | boolean | Pending cancellation |
| created | timestamptz | Creation time |
| current_period_start | timestamptz | Current billing period start |
| current_period_end | timestamptz | Current billing period end |
| ended_at | timestamptz | Subscription end time |
| cancel_at | timestamptz | Scheduled cancellation time |
| canceled_at | timestamptz | When cancellation was requested |
| trial_start | timestamptz | Trial start |
| trial_end | timestamptz | Trial end |
| metadata | jsonb | Stripe metadata |

### usage_logs
Tracks resource usage per user for metering and billing.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| user_id | uuid (FK) | References auth.users |
| resource_type | text | e.g. 'api_calls', 'storage', 'exports' |
| quantity | integer | Usage amount (default 1) |
| metadata | jsonb | Additional context |
| created_at | timestamptz | When usage occurred |

**Indexes:** user_id, resource_type, created_at, composite (user_id, resource_type, created_at)

### organizations
Multi-tenant organization/team support.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| name | text | Organization name |
| slug | text (unique) | URL-friendly identifier |
| owner_id | uuid (FK) | References auth.users |
| settings | jsonb | Org-level settings |
| created_at | timestamptz | Creation time |

### organization_members
Join table for users ↔ organizations with roles.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| organization_id | uuid (FK) | References organizations (cascade delete) |
| user_id | uuid (FK) | References auth.users |
| role | org_member_role | 'owner', 'admin', or 'member' |
| invited_by | uuid (FK) | References auth.users |
| joined_at | timestamptz | When member joined |

**Constraint:** unique(organization_id, user_id)

### audit_logs
Immutable log of user actions. No update/delete allowed.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| user_id | uuid (FK) | References auth.users |
| action | text | e.g. 'user.login', 'org.invite' |
| resource_type | text | e.g. 'user', 'organization' |
| resource_id | uuid | ID of affected resource |
| metadata | jsonb | Action details |
| ip_address | inet | Client IP |
| user_agent | text | Client user agent |
| created_at | timestamptz | When action occurred |

## RLS Policies Summary

| Table | Select | Insert | Update | Delete |
|-------|--------|--------|--------|--------|
| users | Own data + org members + admins | Trigger only | Own data (role change blocked) | — |
| customers | — (service role only) | — | — | — |
| products | Public | — | — | — |
| prices | Public | — | — | — |
| subscriptions | Own data + admins | — | — | — |
| usage_logs | Own data + admins | Service role | — | — |
| organizations | Members | Authenticated (as owner) | Owners/admins | Owner only |
| organization_members | Org members | Owners/admins | Owners/admins | Owners/admins + self-remove |
| audit_logs | Admins only | Service role | — | — |

## Helper Functions

### `is_admin()` → boolean
Returns true if the current authenticated user has the 'admin' role.

### `is_org_member(org_id uuid)` → boolean
Returns true if the current user is a member of the specified organization.

### `get_org_role(org_id uuid)` → org_member_role
Returns the current user's role in the specified organization.

### `get_user_usage(user_id, resource_type, start_date, end_date)` → bigint
Returns total usage quantity for a user/resource within a date range.

```sql
select public.get_user_usage('user-uuid', 'api_calls', '2026-03-01', '2026-04-01');
```

### `check_usage_limit(user_id, limit)` → boolean
Returns true if the user's current-month usage is below the limit.

```sql
select public.check_usage_limit('user-uuid', 1000);
```

### `get_user_subscription_status(user_id)` → table
Returns the user's active subscription with product details.

```sql
select * from public.get_user_subscription_status('user-uuid');
```

### `create_audit_log(...)` → uuid
Creates an audit log entry. Returns the log ID.

```sql
select public.create_audit_log(
  'user-uuid', 'user.login', 'user', 'user-uuid',
  '{"method": "oauth"}'::jsonb, '192.168.1.1'::inet, 'Mozilla/5.0...'
);
```

## Migrations

| Order | File | Description |
|-------|------|-------------|
| 1 | `20240115041359_init.sql` | Base schema: users, customers, products, prices, subscriptions |
| 2 | `20260326000000_add_user_roles.sql` | User roles (user/admin), is_admin(), role change protection |
| 3 | `20260326100000_extended_user_profiles.sql` | Profile fields, preferences, timestamps, updated_at trigger |
| 4 | `20260326100001_usage_tracking.sql` | Usage logs table with indexes and RLS |
| 5 | `20260326100002_teams_foundation.sql` | Organizations, members, org triggers and helpers |
| 6 | `20260326100003_audit_logs.sql` | Audit logs with create_audit_log() function |
| 7 | `20260326100004_rls_enhancements.sql` | Helper functions, cross-table RLS policies |
