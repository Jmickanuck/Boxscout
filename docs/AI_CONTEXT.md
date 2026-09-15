# BoxScout AI Context

This is the compact starting context for coding agents. Read this file, `docs/PHASE_1_STATUS.md`, and the single active execution plan before opening broader documentation.

## Product

BoxScout is a mobile-first soccer-card sealed-box buying intelligence platform.

Primary user question:

> Which box should I buy, what should I pay, and where should I buy it?

Cards, checklists, variants, odds, sales and surfaced finite hits are supporting intelligence. BoxScout is not primarily a collection manager or checklist site.

## Current phase

Golden Product: **2026 Panini Prizm FIFA World Cup Soccer**.

Current active plan: `docs/exec-plans/active/010-complete-golden-product-release-catalogue.md`.

Plan 010 must make the release catalogue trustworthy and measurable before more box UI, chase tracking, sales ingestion or Product #2.

Latest reviewed pre-Plan-010 publication state:

- 1 release
- 1,010 checklist entries
- 10,342 variants
- 9 configurations
- 13,807 eligibility links
- 2 sealed-price observations

These counts are not proof of full release coverage.

## Architecture

Keep the modular monolith:

```text
Next.js UI
  -> domain logic
  -> repositories
  -> approved publication snapshot

external sources
  -> raw/candidate extracts
  -> deterministic normalization/validation
  -> review/discrepancies
  -> PostgreSQL/Supabase canonical catalogue
  -> approved publication snapshot
```

PostgreSQL is canonical. The public app intentionally makes no runtime database requests for catalogue browsing.

## Core identity boundaries

Never collapse these concepts:

```text
Release / Set
  -> Box Format
      -> Box Version / Configuration
          -> Retailer Listing / Offer

Release / Set
  -> Card Subset
      -> ChecklistEntry
          -> Variant
              -> future FiniteInstance
                  -> future SurfaceObservation
                      -> Evidence

Configuration <-> VariantEligibility
```

Missing eligibility means UNKNOWN, not EXCLUDED.

## Trust rules

- Never invent data.
- Unknown is valid.
- Preserve provenance.
- RAW/CANDIDATE data never silently becomes canonical VERIFIED data.
- Listing prices and completed sales are different observations.
- No public-evidence record does not mean a finite card is definitely still sealed.
- Do not publish opaque EV/fair-value claims before inputs are defensible.
- Preserve stable IDs and browser-local Owned/Watching semantics.

## AI/token efficiency rules

Use deterministic software for bulk work and AI for ambiguity.

Do **not** open or paste large generated/import artifacts into model context unless the task explicitly requires the raw records. In particular avoid:

- `src/data/published/catalogue.ts`
- `data/imports/**/input.json`
- `data/imports/**/reviewed.json`
- complete source workbooks/pages

Prefer compact manifests, counts, discrepancy ledgers, targeted searches and small extracted slices.

Desired pattern:

```text
50,000 source rows
  -> parser / normalizer / deterministic comparison
  -> compact coverage report + small discrepancy set
  -> AI reviews only the ambiguous records
```

Never use an LLM to perform a bulk join, count, hash, exact dedupe or deterministic field comparison that normal code can perform reliably.

## Read detailed docs only when relevant

- product behavior / terminology -> `docs/PRODUCT.md`
- architecture -> `docs/ARCHITECTURE.md`
- canonical data rules -> `docs/DATA_INTEGRITY.md`, `docs/DATA_MODEL.md`
- UI work -> `docs/UI_SPEC.md`, `docs/BOX_FIRST_UI_DIRECTION.md`
- Golden Product evidence/history -> `docs/GOLDEN_PRODUCT.md`
- database/publication/backups -> `docs/PERSISTENCE_RUNBOOK.md`
- local implementation workflow -> `docs/ASTRA_RUNBOOK.md`
- monetization -> `docs/MONETIZATION.md` and ADR 004

Do not preload all of these for unrelated tasks.

## Current efficiency risks

1. `src/data/published/catalogue.ts` is already large and must not remain the long-term publication format.
2. Full-release expansion could reach tens of thousands of variants; publication output must be shardable and queryable by release/domain.
3. Repository lookups should use precomputed indexes rather than repeated whole-array scans as data grows.
4. CI should independently run lint, typecheck, tests and production build.
5. Documentation should remain current and compact enough that agents do not reconcile obsolete project history every session.

## Completion discipline

For meaningful code work: inspect -> plan -> implement smallest coherent slice -> lint/typecheck/test/build -> review diff -> commit/push -> verify remote.

Do not rewrite healthy architecture merely to make it look newer.