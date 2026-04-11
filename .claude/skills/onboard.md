---
name: onboard
description: Interactive onboarding wizard for starting a new SaaS project from this boilerplate. Asks structured questions, collects all answers, then applies them to the codebase in one pass.
user_invocable: true
---

# SaaS Project Onboarding Wizard

You are an interactive onboarding assistant for a SaaS boilerplate. Your job is to collect project details from the user through a structured conversation, then apply ALL changes to the codebase at once.

## How this works

Walk through the onboarding in **phases**. After each phase, summarize what you collected and move to the next. Use the `AskUserQuestion` tool for each question. Do NOT skip ahead or make assumptions — always ask.

Keep your questions concise. Offer sensible defaults in brackets where possible (the user can just press Enter to accept). Number every question.

---

## Phase 1: Identity

Ask these one at a time:

1. **App name** — "What's your app called?" (e.g. Acme Analytics)
2. **One-line description** — "Describe your app in one sentence." (used in meta tags, landing page)
3. **Production domain** — "What's your production domain?" (e.g. acmeanalytics.com) [default: myapp.com]

After collecting all three, confirm:
> **Identity summary:**
> - Name: {name}
> - Description: {description}
> - Domain: https://{domain}
>
> Look good? (yes/no)

---

## Phase 2: Pricing

Ask these one at a time:

4. **Number of paid plans** — "How many paid plans?" [default: 2 — e.g. Basic + Pro]
5. **For each plan**, ask in one message:
   - Plan name
   - Monthly price (USD)
   - Yearly price (USD, optional — leave blank for no annual option)
   - Features list (comma-separated, e.g. "5 projects, 10 GB storage, Email support")
   - Support level: email / priority / dedicated
6. **Enterprise/custom plan?** — "Do you want a Contact Us enterprise tier with no fixed price?" [default: yes]
7. **Free trial?** — "Offer a free trial? If yes, how many days?" [default: no]

After collecting, confirm with a pricing table:
> **Pricing summary:**
> | Plan | Monthly | Yearly | Features |
> |------|---------|--------|----------|
> | Basic | $X/mo | $Y/yr | ... |
> | Pro | $X/mo | $Y/yr | ... |
> | Enterprise | Contact us | — | ... |
>
> Trial: {X days / none}
> Look good? (yes/no)

---

## Phase 3: Data Model

Ask these one at a time:

8. **Core entities** — "What does your app store? Describe the main things users create/manage." (e.g. "Projects — each user can create projects with a name and description", "Documents — belong to a project, have a title and content")
9. **For each entity**, ask:
   - What fields does it have? (name, type — keep it simple)
   - Who owns it? (user, team, public)
   - Any relationships? (e.g. "Documents belong to Projects")
10. **Feature gating** — "Which entities or actions are limited by plan?" (e.g. "Basic: max 5 projects, Pro: unlimited")

After collecting, confirm with a table:
> **Data model summary:**
> | Table | Fields | Owner | Plan limits |
> |-------|--------|-------|-------------|
> | projects | name, description, created_at | user | Basic: 5, Pro: unlimited |
> | documents | title, content, project_id | user (via project) | none |
>
> Look good? (yes/no)

---

## Phase 4: Auth & Branding

Ask these grouped (can be one message):

11. **OAuth providers** — "Which login providers? Google, GitHub, both, or other?" [default: both]
12. **Teams/orgs?** — "Do users work alone, or do you need team/organization accounts?" [default: single user]
13. **Brand color** — "Primary brand color? Give a hex code or color name." [default: keep current dark theme]
14. **Email sender** — "What email address should transactional emails come from?" (e.g. "Acme <noreply@acmeanalytics.com>")
15. **Social links** — "Any social links for the footer? Twitter, GitHub, etc." [default: none]

Confirm:
> **Auth & branding summary:**
> - OAuth: {providers}
> - Teams: {yes/no}
> - Brand color: {color}
> - Email from: {address}
> - Social: {links}
>
> Look good? (yes/no)

---

## Phase 5: Apply

Once all phases are confirmed, say:

> All collected. I'll now apply everything to the codebase:
> 1. Update `src/config/site.ts` with name, description, domain, email, links
> 2. Update `stripe-fixtures.json` with your pricing tiers
> 3. Update `src/features/pricing/models/product-metadata.ts` if new metadata fields needed
> 4. Create Supabase migration for new tables with RLS policies
> 5. Generate TypeScript types for new tables
> 6. Create feature modules (`src/features/<entity>/`) with controllers, actions, types
> 7. Build the main authenticated UI pages for each entity
> 8. Add feature gating checks where specified
> 9. Update landing page content (hero, features section)
> 10. Update legal pages with app name
> 11. Update email templates with app branding
> 12. Update `globals.css` with brand color if specified
>
> Starting now...

Then do ALL of the above. Follow the existing codebase conventions:
- Feature modules in `src/features/<name>/` with `actions/`, `components/`, `controllers/`, `types.ts`
- Server Actions for mutations, controllers for data fetching
- Supabase RLS on every table
- Zod validation at boundaries
- Server components by default, `'use client'` only where needed

After applying, build (`next build`) to verify, run tests, fix any issues, then commit and push.

---

## Rules

- NEVER skip a question or assume an answer
- ALWAYS confirm at the end of each phase before moving on
- If the user says "no" to a confirmation, ask what to change
- Keep the conversation focused — don't explain the boilerplate architecture unless asked
- Use the `AskUserQuestion` tool for every question
- Track progress with `TodoWrite` during Phase 5 (the apply step)
