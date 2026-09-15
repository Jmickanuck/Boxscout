# BoxScout Change Log

This file records high-value project changes that future agents should be able to reconstruct without reading chat history or Git history commit-by-commit.

It is not an execution plan. Current scope and sequencing live in `PHASE_1_STATUS.md` and the single active plan.

## 2026-09-15 — Box-first product reset

The live mobile audit established the durable product direction:

- BoxScout is primarily a **sealed-box buying intelligence platform**.
- Primary user question: **Which box should I buy, what should I pay, and where should I buy it?**
- Card/checklist data supports the box decision; BoxScout must not drift into being primarily a checklist/collection app.
- Homepage direction is a collector-intelligence dashboard with featured boxes, notable pulls/sales, price movement and other real data when available.
- Canonical terminology is now:
  - Release / Set
  - Box Format
  - Box Version / Configuration
  - Retailer Listing / Offer
  - optional evidence-backed Pull Profile
  - Card Subset
  - Checklist Entry
  - Variant
- Box versions/configurations must not be called card subsets.
- Future box pages should emphasize current/typical sealed price, where to buy, contents/hit structure, exact eligible chases, surfaced finite evidence and later transparent comparative value.
- Future fair-value work must expose inputs/uncertainty and must not be a black-box AI score.

Primary documents:

- `PRODUCT.md`
- `PRODUCT_AUDIT_2026-09-15.md`
- `BOX_FIRST_UI_DIRECTION.md`
- `PHASE_1_STATUS.md`

## 2026-09-15 — Phase 1 recovery sequencing

Architecture review found the codebase fundamentally healthy, but the visible UI had begun to outrun data completeness.

Approved sequence:

1. Plan 010 — Complete Golden Product release catalogue
2. Plan 011 — Resolve exact Mega identities, Pull Profiles and configuration eligibility
3. Plan 012 — Box-first frontend and pricing presentation refinement
4. Plan 013 — Major chase / finite-instance surfaced tracking
5. Plan 014 — Card sales plus sealed-price market intelligence
6. Plan 015 — Box comparison and first transparent value model
7. Product #2 only after Golden Product #1 is genuinely useful before a purchase

Plan 010 remains the only current execution authority.

## 2026-09-15 — AI/token and scale hardening

A repository audit identified avoidable future token/runtime costs, especially the approximately 12.6 MB generated publication module and multi-megabyte import artifacts.

Implemented changes:

- Created `AI_CONTEXT.md` as the compact mandatory agent context.
- Changed agent instructions to load detailed documentation only when relevant.
- Added explicit guardrails against feeding bulk generated/import data to LLMs for deterministic work.
- Adopted deterministic-first processing: code handles parsing, normalization, counts, joins, hashing, exact comparison and dedupe; AI reviews ambiguity/discrepancies.
- Added compact `src/data/published/manifest.json` for revision/count inspection.
- Made the publication writer release/domain-shard ready while preserving `catalogue.ts` as a compatibility artifact.
- Added publication-sharding design documentation in `PUBLICATION_SHARDING.md`.
- Added shared repository indexes and cached variant-browse indexes to reduce repeated whole-array scans.
- Added GitHub Actions CI for lint, typecheck, tests and production build.
- Added EditorConfig, Prettier configuration, formatting scripts and LF normalization for generated/import/publication data.
- Refreshed stale README, architecture and Golden Product documentation.
- Added explicit active-plan guidance so historical Plans 001–009 are not preloaded as current scope.
- Recorded the architectural decision in `decisions/007-ai-efficient-data-processing.md`.

The hardening checkpoint at commit `b4cfca6b21a6b879def8a7811e79f3842512ec0b` passed GitHub CI and Vercel deployment checks.

### Remaining transitional work

- `src/data/published/catalogue.ts` still exists as the runtime compatibility snapshot; migrate consumers to release/domain projections before catalogue scale makes the monolith expensive.
- Release/domain shard files will be emitted by the next approved publication.
- Client payloads should become narrower as release/configuration data grows.
- Off-device scheduled backups are still required before irreplaceable market/surfaced/user data is stored.

## Documentation rule going forward

When a change materially affects product direction, canonical data semantics, architecture, publication/ingestion behavior, runtime scaling, operational recovery or execution sequencing:

1. update the governing document;
2. add a short entry here when the change is important enough that future project context would suffer without it;
3. keep `AI_CONTEXT.md` compact and current;
4. do not use this change log as a substitute for tests, ADRs or execution plans.
