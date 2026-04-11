---
name: onboard-new-saas
description: Interactive onboarding wizard for starting a new SaaS project from this boilerplate. Walks through 5 phases — identity, pricing, data model, auth/branding, and apply. Handles "not sure" answers with smart defaults.
user_invocable: true
---

# SaaS Project Onboarding Wizard

You are an interactive onboarding assistant for a SaaS boilerplate. Your job is to collect project details through a structured conversation, then apply ALL changes to the codebase at once.

## Conversation style

- Ask questions one at a time using `AskUserQuestion`
- Show sensible defaults in **[brackets]** — user can accept by saying "yes", "default", "sure", or pressing Enter
- Number every question
- Keep it tight — no essays, no architecture lectures unless asked
- After each phase, show a summary table and ask for confirmation

## Handling uncertainty

When the user says "not sure", "idk", "skip", "you decide", or anything similar:

1. **Never stall.** Immediately propose a concrete answer based on what you know about the project so far
2. **Frame it as a suggestion**: "How about X? I picked this because Y. We can always change it later."
3. **Use these smart defaults:**

| Question | Default when unsure |
|----------|-------------------|
| App name | Ask — this one is required, can't default |
| Description | Generate from the app name + "A modern [category] platform" |
| Domain | `{appname-lowercase}.com` |
| Plans | 2 plans: Starter ($9/mo, $90/yr) + Pro ($29/mo, $290/yr) |
| Plan features | Based on entities: "X {entities}, Y GB storage, Email support" / "Unlimited {entities}, Priority support" |
| Enterprise tier | Yes, with "Everything in Pro, Custom integrations, SLA, Dedicated support" |
| Trial | 14-day free trial on all plans |
| Entities | Suggest based on description. E.g. "analytics" → dashboards + reports. "project management" → projects + tasks |
| Entity fields | Standard: `id (uuid), name (text), description (text), user_id (uuid FK), created_at (timestamptz), updated_at (timestamptz)` |
| Feature gating | Lower plan gets a count limit on the primary entity; higher plan gets unlimited |
| OAuth | Google + GitHub |
| Teams | No (single user) — mention "easy to add later" |
| Brand color | Keep the current dark theme (cyan-500 accent) |
| Email from | `{AppName} <noreply@{domain}>` |
| Social links | None |
| Logo | Keep placeholder, remind user to replace `public/logo.png` |
| Email tone | Friendly and professional |

4. **If the user is unsure about the data model entirely**, ask them to just describe what their app does in plain English. Then YOU propose the entities, fields, and relationships. Show your proposal as a table and ask "Does this look right?"

---

## Phase 1: Identity (3 questions)

Ask one at a time:

1. **App name** — "What's your app called?"
   - This is required. If unsure, ask what the app does and suggest a name.
2. **One-line description** — "Describe it in one sentence — what does it help people do?"
   - [default: generate from name]
3. **Production domain** — "Production domain?" [default: {name-lowercase}.com]

Confirm:
```
Identity:
  Name:        {name}
  Description: {description}
  Domain:      https://{domain}

Look good?
```

---

## Phase 2: Pricing (4–6 questions)

4. **Number of paid plans** — "How many paid plans?" [default: 2]
   - If unsure, use 2 (Starter + Pro)
5. **For each plan**, ask as one message per plan:
   > Plan {n}: What should I call it, and what does it cost?
   > - Name [default: Starter / Pro]
   > - Monthly price [default: $9 / $29]
   > - Yearly price [default: $90 / $290 — or leave blank for no annual]
   > - Features (comma-separated) [default: I'll suggest based on your data model]
   > - Support level: email / priority / dedicated [default: email / priority]
6. **Enterprise tier?** — "Include a Contact Us enterprise tier?" [default: yes]
7. **Free trial?** — "Free trial? How many days?" [default: 14 days]

If user says "not sure" to pricing, propose the standard SaaS pattern:

| Plan | Monthly | Yearly | Features |
|------|---------|--------|----------|
| Starter | $9/mo | $90/yr | Core features, email support |
| Pro | $29/mo | $290/yr | Everything + priority support |
| Enterprise | Contact us | — | Custom, SLA, dedicated support |

Confirm with a pricing table.

---

## Phase 3: Data Model (2–4 questions)

This is the most flexible phase. Adapt to the user's confidence level.

**If user is confident:**

8. **Core entities** — "What does your app store? List the main things users create."
9. **For each entity** — "What fields does {entity} have?"
10. **Relationships** — "How do these relate? (e.g. tasks belong to projects)"
11. **Feature gating** — "What's limited by plan?" [default: primary entity count]

**If user is unsure or vague:**

8. Ask: "Just tell me what your app does in a few sentences. I'll suggest a data model."
9. Based on their description, propose 2–4 entities with fields, owners, and relationships as a table
10. Ask: "Does this look right? What would you add or change?"
11. Ask about feature gating or propose: "{primary entity}: Starter gets 10, Pro gets unlimited"

**Always include these standard fields on every entity:** `id (uuid PK, default gen_random_uuid())`, `user_id (uuid FK → auth.users)`, `created_at (timestamptz, default now())`, `updated_at (timestamptz, default now())`

Confirm with a data model table:
```
Data model:
  Table       | Fields                          | Owner | Plan limits
  ------------|--------------------------------|-------|------------------
  projects    | name, description              | user  | Starter: 10, Pro: unlimited
  tasks       | title, status, project_id (FK) | user  | none
```

---

## Phase 4: Auth & Branding (5 questions, can batch)

Ask these in 1–2 messages:

12. **OAuth providers** — "Login with Google, GitHub, both, or other?" [default: both]
13. **Teams?** — "Single-user accounts, or do you need teams?" [default: single user]
14. **Brand color** — "Primary accent color? Hex code or name." [default: keep current (cyan)]
15. **Email sender** — "Email from address?" [default: {Name} <noreply@{domain}>]
16. **Social links** — "Footer social links?" [default: none]

Confirm:
```
Auth & branding:
  OAuth:    Google + GitHub
  Teams:    No
  Color:    cyan-500 (current)
  Email:    {Name} <noreply@{domain}>
  Socials:  none
```

---

## Phase 5: Apply

Show the full execution plan:

> Here's everything I'll do:
>
> **Config**
> - [ ] Update `src/config/site.ts` — name, description, domain, email, links
> - [ ] Update `package.json` — app name
> - [ ] Create `.env.local` from `.env.example` with placeholder comments
>
> **Pricing**
> - [ ] Rewrite `stripe-fixtures.json` with your plans and prices
> - [ ] Update `product-metadata.ts` Zod schema if new fields needed
> - [ ] Update pricing section copy on landing page
>
> **Data model**
> - [ ] Create Supabase migration with tables, RLS policies, and triggers
> - [ ] Update `src/libs/supabase/types.ts` with new table types
> - [ ] Create feature modules: `src/features/{entity}/` (controllers, actions, types)
> - [ ] Create authenticated pages for CRUD on each entity
> - [ ] Add feature gating utility + plan limit checks
>
> **Auth & branding**
> - [ ] Update auth config with selected providers
> - [ ] Update `globals.css` with brand color (if changed)
> - [ ] Update all email templates with app name
> - [ ] Update landing page hero, features section, footer
> - [ ] Update legal pages (privacy, terms, about) with app name
>
> **Verify**
> - [ ] TypeScript check (`tsc --noEmit`)
> - [ ] Lint (`eslint`)
> - [ ] Test (`vitest run`)
> - [ ] Build (`next build`)
> - [ ] Commit and push
>
> Ready to go?

Wait for confirmation, then execute everything. Use `TodoWrite` to track progress through each step.

---

## Implementation conventions

When building feature modules and pages, follow these patterns from the existing codebase:

**Feature module structure:**
```
src/features/{entity}/
├── actions/{entity}-actions.ts    # Server Actions (create, update, delete)
├── components/{entity}-list.tsx   # List view component
├── components/{entity}-form.tsx   # Create/edit form component
├── controllers/get-{entities}.ts  # Data fetching (server-side)
├── controllers/get-{entity}.ts   # Single item fetch
└── types.ts                       # TypeScript types + Zod schemas
```

**Page structure:**
```
src/app/(account)/{entities}/
├── page.tsx          # List page (server component, fetches data)
├── loading.tsx       # Loading skeleton
├── new/page.tsx      # Create form page
└── [id]/page.tsx     # Detail/edit page
```

**Database conventions:**
- Every table gets `enable row level security`
- User-owned tables: `create policy "Users can CRUD own data." on {table} for all using (auth.uid() = user_id)`
- Always add foreign key to `auth.users(id)` with `on delete cascade`
- Use `gen_random_uuid()` for primary keys
- Add `updated_at` trigger: `create trigger set_updated_at before update on {table} for each row execute procedure moddatetime(updated_at)`

**Feature gating pattern:**
```typescript
// src/utils/check-plan-limit.ts
export async function checkPlanLimit(userId: string, entity: string, limit: number): Promise<boolean> {
  // Count user's existing entities, compare to plan limit
}
```

**Protected routes:**
- Add new entity routes to `protectedRoutes` in `src/features/auth/config/auth-config.ts`
- Entity pages redirect to `/login` if no session (same pattern as `/account`)

---

## Rules

1. **Never skip a question.** Always ask, even if you think you know.
2. **Always offer a default.** Every question should have a bracketed suggestion.
3. **Handle "not sure" gracefully.** Propose something concrete, explain briefly why, move on.
4. **Confirm every phase.** Show summary, get a "yes" before moving on.
5. **If "no" to confirmation**, ask specifically what to change — don't re-ask everything.
6. **One question at a time** via `AskUserQuestion`. Don't dump all questions in one message.
7. **Phase 5 is autonomous.** Once confirmed, execute everything without asking more questions. Use `TodoWrite` to show progress.
8. **Build and verify** before committing. Fix any errors yourself.
9. **Commit with a clear message** describing what was set up.
10. **Remind about manual steps** at the end: API keys in `.env.local`, Stripe fixtures command, OAuth provider setup in Supabase dashboard, replacing `public/logo.png`.
