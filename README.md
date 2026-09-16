# BoxScout

BoxScout is a mobile-first soccer-card **sealed-box buying intelligence platform**.

Primary question:

> **Which box should I buy, what should I pay, and where should I buy it?**

Cards, checklists, variants, prices, sales and surfaced finite hits are supporting intelligence for that decision.

## Current Phase 1

Golden Product: **2026 Panini Prizm FIFA World Cup Soccer**.

Current active work is Plan 010: complete the release catalogue and exact variants before further box UI/chase/market expansion.

Start with:

- `docs/AI_CONTEXT.md`
- `docs/PHASE_1_STATUS.md`
- `docs/exec-plans/active/010-complete-golden-product-release-catalogue.md`

## Product planning

The [working master plan](docs/MASTER_PLAN.md) connects the buying journey to the existing milestones, records open product decisions, and proposes bounded desktop handoffs. It distinguishes established requirements from recommendations and does not replace Plan 010 or authorize later features. Read it for planning, not as mandatory context for every coding task.

## Stack

- Next.js 16 / React 19 / TypeScript
- mobile-first App Router UI
- PostgreSQL 17 on Supabase as canonical catalogue storage
- approved static publication snapshot for Vercel browsing
- browser-local Owned/Watching state; no accounts yet
- Node 24+

The public catalogue intentionally requires **zero runtime database requests**. PostgreSQL is canonical, then reviewed data is approved and exported to a deterministic publication artifact committed to Git/Vercel.

## Architecture

```text
external sources
  -> raw/candidate records
  -> deterministic normalization + validation
  -> discrepancy review
  -> PostgreSQL canonical catalogue
  -> approved publication snapshot
  -> repositories/domain
  -> Next.js UI
```

Main code boundaries:

```text
src/app/          routes/server composition
src/components/   UI components
src/domain/       business rules
src/repositories/ data-access/projection boundaries
src/types/        shared domain/publication types
src/data/         fixtures + generated public data
scripts/          ingestion, database and image tooling
db/migrations/    versioned PostgreSQL schema
```

Do not query the database from React components. Do not put canonical facts into browser-local collection state.

## Run locally

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

Owned/Watching data is browser/origin-local. Clearing site data removes it; it is not cloud synced.

## Required checks

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run build` runs deterministic checklist, variant, image and publication checks before Next.js builds.

Useful operator commands include:

```powershell
npm run db:migrate
npm run db:import
npm run db:parity
npm run db:approve
npm run db:publish
npm run db:backup
npm run db:test
```

See `docs/PERSISTENCE_RUNBOOK.md` before database operations.

## Current catalogue state

Latest reviewed state before Plan 010 completion:

- 1,010 checklist entries
- 10,342 exact variants
- 13,807 configuration/variant eligibility links
- 9 release configurations
- 2 sealed-price observations

This is **not yet the complete release catalogue**. Missing/unresolved families must remain visibly partial rather than being inferred or invented.

## Data integrity

Key rules:

- unknown is valid;
- preserve provenance;
- RAW/CANDIDATE does not silently become canonical VERIFIED data;
- release membership does not prove box eligibility;
- listing price does not equal completed-sale price;
- absence of public pull evidence does not prove a finite card remains sealed;
- no opaque EV/fair-value score before the underlying assumptions are defensible.

See `docs/DATA_INTEGRITY.md` and `docs/DATA_MODEL.md`.

## AI/token efficiency

Agents should **not** read bulk generated/import data unless directly required. In particular, avoid loading `src/data/published/catalogue.ts` or multi-megabyte `data/imports/**/input.json` / `reviewed.json` into model context.

Use parsers and deterministic comparison first, then give AI compact summaries/discrepancies. See `docs/AI_CONTEXT.md`.

## Images

Card/product imagery is rights-gated independently from identity matching. Missing images use intentional placeholders. Do not copy marketplace/checklist images into the public catalogue without suitable permission.

## Git / completion

GitHub is canonical code/history. Meaningful work is not complete until checks pass, the diff is reviewed, changes are committed/pushed, the remote is verified, and the working tree is clean.

On Justin's Windows PC use:

`C:\Program Files\Git\cmd\git.exe`

without changing system PATH.
