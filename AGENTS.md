# BoxScout Agent Instructions

BoxScout is a mobile-first soccer-card sealed-box buying intelligence platform.

## Required startup context

Before meaningful work, read only:

1. `docs/AI_CONTEXT.md`
2. `docs/PHASE_1_STATUS.md`
3. the single current active execution plan named below

Then read detailed documents **only when the task touches that area**. Do not preload the entire documentation set.

### Conditional documentation

- product behavior / terminology -> `docs/PRODUCT.md`
- architecture/refactor -> `docs/ARCHITECTURE.md`
- catalogue/import/evidence -> `docs/DATA_INTEGRITY.md` and `docs/DATA_MODEL.md`
- UI/frontend -> `docs/UI_SPEC.md` and `docs/BOX_FIRST_UI_DIRECTION.md`
- Golden Product evidence/history -> `docs/GOLDEN_PRODUCT.md`
- database/publication/backup -> `docs/PERSISTENCE_RUNBOOK.md`
- PC/local implementation workflow -> `docs/ASTRA_RUNBOOK.md`
- monetization -> `docs/MONETIZATION.md` and ADR 004

`docs/PRODUCT_AUDIT_2026-09-15.md` is historical requirements context. Read it only when the origin of the box-first decisions matters.

Older execution plans are implementation history, not current authorization.

## Active plan

Read and execute only:

`docs/exec-plans/active/010-complete-golden-product-release-catalogue.md`

Approved sequence after Plan 010:

1. Plan 011 — exact Mega identities, pull profiles and configuration eligibility
2. Plan 012 — box-first frontend and pricing presentation
3. Plan 013 — major chase / finite-instance surfaced tracking
4. Plan 014 — card sales plus sealed-price market intelligence
5. Plan 015 — box comparison and first transparent value model
6. Product #2 only after Golden Product #1 is genuinely useful before a purchase

## Product rule

The primary user question is:

> **Which box should I buy, what should I pay, and where should I buy it?**

Cards/checklists are supporting intelligence. Do not let BoxScout drift into being primarily a collection manager or generic checklist site.

## Hard data/product rules

- Never invent card, checklist, configuration, pricing, odds, image, sale or surfaced-card data.
- UNKNOWN is a valid answer.
- Preserve provenance and source-specific semantics.
- RAW/CANDIDATE data must never silently become canonical REVIEWED/VERIFIED data.
- Release membership, exact variant identity, configuration eligibility and retailer listing identity are separate facts.
- Missing eligibility means UNKNOWN, never EXCLUDED.
- A partial catalogue must never be presented as complete/full.
- Box versions/configurations are not card subsets.
- Similar pack counts, UPC proximity or copied retailer text do not prove equivalent pull structure.
- Listing prices and completed sales are separate market observations.
- No public evidence of a finite card does not prove it remains sealed.
- Do not publish black-box EV/fair-value scores before probability/market assumptions are defensible and inspectable.
- Keep canonical facts separate from browser-local/user state.
- Preserve stable IDs unless an explicitly reviewed migration is necessary.

## AI/token efficiency — mandatory

Use deterministic code for bulk data work. Use AI for ambiguity, interpretation and reviewed decisions.

### Large-file guardrail

Do **not** open, paste, summarize or repeatedly parse large generated/raw artifacts unless the task explicitly requires the raw records. Avoid by default:

- `src/data/published/catalogue.ts`
- `data/imports/**/input.json`
- `data/imports/**/reviewed.json`
- full workbooks, PDFs or copied source pages

Prefer:

- `src/data/published/manifest.json`
- generated coverage/summary artifacts
- counts and hashes
- discrepancy ledgers
- targeted repository searches
- bounded record slices

The intended workflow is:

```text
bulk source data
  -> parser / normalizer / deterministic comparison
  -> compact summary + discrepancy set
  -> AI reviews only ambiguous records
```

Never spend LLM tokens doing deterministic joins, counting, hashing, exact dedupe or whole-dataset comparison that ordinary code can do reliably.

## Architecture discipline

- Keep the modular monolith.
- Keep UI, domain logic, repositories and persistence concerns separate.
- Do not introduce auth, payments, broad scraping, microservices or new infrastructure unless the active plan explicitly authorizes it.
- Do not rewrite working architecture merely to modernize it.
- Prefer small coherent changes with explicit tests.
- PostgreSQL is canonical; the public app consumes an approved publication snapshot and does not require runtime DB access for catalogue browsing.

## Required implementation loop

For meaningful work:

1. Inspect repository/status and relevant current docs.
2. Update the active plan if implementation scope materially changes.
3. Implement the smallest coherent slice.
4. Run the applicable checks.
5. Review the complete diff.
6. Fix regressions.
7. Update current documentation when behavior/architecture changed.
8. Commit and push coherent work.
9. Verify the remote branch contains the commit and the working tree is clean.

## Verification

For application changes run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Run database integration tests when database/import/publication behavior changes. Never invent a passing result.

CI is an independent safety net, not a substitute for local verification.

## Definition of done

A task is not complete until:

1. required checks pass;
2. diff is reviewed and within scope;
3. commits are coherent;
4. changes are pushed;
5. remote branch is verified;
6. working tree is clean.

No force-push to main. If remote history unexpectedly diverges, stop and investigate.

## Backup responsibilities

- code/docs -> GitHub
- PostgreSQL/live data -> database backup/export
- images/evidence binaries -> future object-storage backup/versioning

Before irreplaceable market/surfaced/user data exists, off-device scheduled backups are mandatory.

## Current project-state warning

The current publication module is large. Treat `src/data/published/catalogue.ts` as generated output, not normal reading material. The publication system is being evolved toward compact manifests and sharded outputs before full-release scale. Do not build new features that deepen coupling to the monolithic generated file.