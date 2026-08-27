# Betta Freaks

A custom storefront and owner application for individually listed betta fish, accessories, and live foods.

The implementation follows [the project guide](sources/betta-freaks-web-app-implementation-plan.md) and [the visual concept brief](Betta_Freaks_Website_Concept_Brief.pdf).

## Current milestone

- Branded responsive storefront
- Demo catalog with URL-based male/female filtering
- Product detail and persistent local cart
- Protected owner dashboard, product editor, and development-only previews
- Controlled inventory adjustments with exact-fish limits and an append-only movement log
- Supabase authentication plus an RLS-first commerce schema applied to the Betta Freaks project
- Stripe checkout boundary that remains disabled until credentials are configured
- Type checking, linting, unit tests, and production build scripts

The catalog data is intentionally marked as sample inventory. It must be replaced with exact product records and media before launch.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

The storefront works without provider credentials. Supabase authentication, owner access, and Stripe Checkout become available after the corresponding environment variables and remote projects are configured.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Database

Supabase configuration and migrations live under `supabase/`. The owner inventory RPC runs with the signed-in caller's permissions; a non-callable trigger records every stock delta, while authenticated users receive read-only access to movement history. Before applying future migrations to a remote project, review the target project, verify CLI versions, run the migration locally, exercise RLS as each role, and run the Supabase database advisors.
