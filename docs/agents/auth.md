# Auth Agent — Implementation Report

## Session Date
2026-03-26

## What Was Implemented

### 1. User Roles System
- **Migration**: `supabase/migrations/20260326000000_add_user_roles.sql`
  - `user_role` enum type (`user`, `admin`)
  - `role` column on `users` table (default: `user`)
  - `is_admin()` helper function for RLS policies
  - Admin-can-read-all-users RLS policy
  - Trigger to prevent users from changing their own role (only service_role can)

### 2. Auth Configuration
- **`src/features/auth/config/auth-config.ts`** — Central config:
  - OAuth provider definitions (Google, GitHub) with setup instructions
  - Protected routes list (`/account`, `/dashboard`, `/manage-subscription`)
  - Admin routes list (`/admin`)
  - Redirect constants

### 3. Auth Actions (Consolidated)
- **`src/features/auth/actions/auth-actions.ts`** — All auth server actions:
  - `signInWithOAuth(provider)` — GitHub/Google OAuth
  - `signInWithEmail(email)` — Magic link OTP
  - `signOut()` — Sign out
  - `resetPassword(email)` — Send password reset email
  - `updatePassword(newPassword)` — Set new password after recovery

### 4. Route Protection (Middleware)
- **Updated `src/libs/supabase/supabase-middleware-client.ts`**:
  - Protected routes: redirects unauthenticated users to `/login` with `?redirectTo=` param
  - Admin routes: checks `users.role` column, redirects non-admins to `/`
  - Fixed bug: anon key env var name was wrong (`NEXT_PUBLIC_SUPABASE_URL` instead of `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 5. Auth Components
- **`src/features/auth/components/oauth-buttons.tsx`** — Configurable OAuth button list driven by `auth-config.ts`
- **`src/features/auth/components/email-form.tsx`** — Extracted email login form (collapsible)
- **`src/features/auth/components/role-guard.tsx`** — Server component for role-based access gating
- **`src/features/auth/hooks/get-user-with-role.ts`** — Server-side user fetch with role field
- **`src/features/auth/hooks/use-auth.ts`** — Client-side reactive auth hook
- **`src/features/auth/index.ts`** — Barrel export for clean imports

### 6. Password Reset Flow
- **`src/app/(auth)/reset-password/page.tsx`** — Enter email, sends reset link
- **`src/app/(account)/account/update-password/page.tsx`** — Set new password after clicking reset link
- Auth callback updated to handle `?type=recovery` redirect

### 7. Updated Existing Pages
- Login page: added "Forgot your password?" link, imports from new auth module
- Signup page: imports from new auth module
- Navigation: imports `signOut` from new auth module
- Auth callback: uses auth-config constants, handles recovery flow

## Files Created
```
src/features/auth/
├── actions/auth-actions.ts
├── components/
│   ├── oauth-buttons.tsx
│   ├── email-form.tsx
│   └── role-guard.tsx
├── config/auth-config.ts
├── hooks/
│   ├── get-user-with-role.ts
│   └── use-auth.ts
└── index.ts

src/app/(auth)/reset-password/page.tsx
src/app/(account)/account/update-password/page.tsx
supabase/migrations/20260326000000_add_user_roles.sql
```

## Files Modified
```
src/libs/supabase/supabase-middleware-client.ts  (route protection + bug fix)
src/app/(auth)/auth/callback/route.ts            (recovery flow + config constants)
src/app/(auth)/auth-ui.tsx                       (added forgot password link)
src/app/(auth)/login/page.tsx                    (new import path)
src/app/(auth)/signup/page.tsx                   (new import path)
src/app/navigation.tsx                           (new import path)
```

## Configuration Required

### Supabase Dashboard Setup
1. Go to **Authentication → Providers**
2. **Google**: Enable, add Client ID + Secret from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Redirect URI: `https://[PROJECT_REF].supabase.co/auth/v1/callback`
3. **GitHub**: Enable, add Client ID + Secret from [GitHub Developer Settings](https://github.com/settings/developers)
   - Callback URL: `https://[PROJECT_REF].supabase.co/auth/v1/callback`

### Run Migration
```bash
bun migration:up
```

### Promote a User to Admin
```sql
-- Via Supabase SQL editor (uses service_role):
update public.users set role = 'admin' where id = 'USER_UUID_HERE';
```

## Testing Checklist
- [ ] OAuth login (Google) — requires provider configured in Supabase
- [ ] OAuth login (GitHub) — requires provider configured in Supabase
- [ ] Magic link email login
- [ ] Password reset flow (request → email → update)
- [ ] Protected routes redirect to /login when unauthenticated
- [ ] Admin routes redirect to / for non-admin users
- [ ] RoleGuard component blocks non-admin content
- [ ] User cannot change their own role via Supabase client
- [ ] Admin can view all users via RLS policy
- [ ] `useAuth` hook reactively tracks auth state

## Known Limitations
- The old `src/app/(auth)/auth-actions.ts` still exists (kept for backward compatibility). Can be deleted once all imports are verified to use the new path.
- `useAuth` client hook doesn't include the user's role — role data requires a separate query to the `users` table. Use `getUserWithRole()` in server components instead.
- Password reset flow uses Supabase's built-in email templates. Custom React Email templates for password reset should be implemented by the Email Agent.

## Handoff to Email Agent

### Next: **Email Agent** (`docs/agents/email.md`)

**Tasks for Email Agent**:
1. Create password reset email template (React Email) to replace Supabase default
2. Create email verification template
3. Create subscription confirmation email
4. Create payment failed email
5. Wire up welcome email auto-send on first login (template already exists)
6. Map Stripe webhook events to email triggers
7. Add email preferences (opt-in/out) to user profile
