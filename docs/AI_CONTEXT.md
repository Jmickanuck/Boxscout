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

## Engineering hardening checkpoint — 2026-09-15

The repository was deliberately hardened before Plan 010 scales the catalogue further.

Implemented and retained:

- `AGENTS.md` now uses selective, task-relevant documentation loading instead of requiring every project document up front.
- `docs/AI_CONTEXT.md` is the compact agent starting context.
- `src/data/published/manifest.json` is the preferred small operational snapshot for revision/count inspection.
- The publication writer is shard-ready and writes release/domain shards on the next approved publication while retaining `catalogue.ts` temporarily for compatibility.
- `src/repositories/catalogue-index.ts` provides shared indexed lookup structures for common repository operations.
- Variant browsing caches/indexes repeated lookups instead of rebuilding them on every filter operation.
- GitHub Actions CI runs lint, typecheck, application tests and production build on pushes/PRs to `main`.
- `.editorconfig`, Prettier configuration and lint/format scripts establish consistent source formatting while excluding bulk generated/import data.
- generated/import/publication line endings are pinned to LF to avoid platform-only diffs.
- `docs/decisions/007-ai-efficient-data-processing.md` records the deterministic-first, compact-context architecture decision.
- `docs/PUBLICATION_SHARDING.md` records the migration path away from the giant monolithic publication artifact.
- `docs/exec-plans/active/README.md` explicitly states that Plan 010 is the only current execution authority; Plans 001–009 are historical records.

The last verified hardening commit in this checkpoint is `b4cfca6b21a6b879def8a7811e79f3842512ec0b`; GitHub CI and Vercel both succeeded for that commit.

Do not undo these changes casually. If a future approach replaces them, it must preserve or improve token efficiency, deterministic processing, runtime performance and publication integrity.

## Read detailed docs only when relevant

- product behavior / terminology -> `docs/PRODUCT.md`
- architecture -> `docs/ARCHITECTURE.md`
- canonical data rules -> `docs/DATA_INTEGRITY.md`, `docs/DATA_MODEL.md`
- UI work -> `docs/UI_SPEC.md`, `docs/BOX_FIRST_UI_DIRECTION.md`
- Golden Product evidence/history -> `docs/GOLDEN_PRODUCT.md`
- database/publication/backups -> `docs/PERSISTENCE_RUNBOOK.md`
- local implementation workflow -> `docs/ASTRA_RUNBOOK.md`
- monetization -> `docs/MONETIZATION.md` and ADR 004
- AI/data-processing efficiency -> `docs/decisions/007-ai-efficient-data-processing.md`
- publication scaling -> `docs/PUBLICATION_SHARDING.md`

Do not preload all of these for unrelated tasks.

## Current efficiency state / remaining work

Already addressed:

1. compact AI context and bulk-file guardrails;
2. compact publication manifest;
3. shard-ready publication writer;
4. indexed repository access and cached browse indexes;
5. CI verification;
6. formatting/EOL hygiene;
7. stale core documentation refresh.

Still intentionally transitional:

1. `src/data/published/catalogue.ts` remains the compatibility runtime artifact until repository consumers migrate safely to shards/projections;
2. release/domain shard files are generated on the next approved database publication, not retroactively manufactured by hand;
3. client payloads should become configuration/release-specific as catalogue scale materially grows;
4. Plan 010 still needs deterministic completeness/coverage reporting and Golden Product release completion;
5. off-device scheduled backups are still required before irreplaceable market/surfaced/user data is stored.

## Completion discipline

For meaningful code work: inspect -> plan -> implement smallest coherent slice -> lint/typecheck/test/build -> review diff -> commit/push -> verify remote.

Do not rewrite healthy architecture merely to make it look newer.
