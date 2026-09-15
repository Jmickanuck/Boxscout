# Execution Plan 010 — Complete Golden Product Release Catalogue

## Status

APPROVED — 2026-09-15.

This is the only active execution plan for current Phase 1 work. It supersedes unfinished sequencing implied by Plans 001-009 without erasing their implementation history.

## Goal

Make the 2026 Panini Prizm FIFA World Cup release catalogue trustworthy and structurally complete enough that BoxScout can accurately distinguish:

1. every reviewed checklist entry that exists in the release;
2. every reviewed exact variant that exists for those entries;
3. unresolved or disputed families that must remain outside canonical publication until reviewed.

This plan is about **release completeness**, not full Mega eligibility, chase tracking, sales ingestion, Compare, Product #2 or visual polish.

### Box-first downstream contract

The release catalogue is being completed because BoxScout is a **sealed-box buying intelligence product**. Cards/checklists are supporting intelligence for the question: **which box should I buy, what should I pay, and where should I buy it?**

Plan 010 must therefore leave clean, reusable release/subset/entry/variant data for later box eligibility, chase, price and comparison work. It must not distort the catalogue to fit the current UI or a particular retailer box. Durable product/UI requirements are in `docs/PRODUCT.md` and `docs/BOX_FIRST_UI_DIRECTION.md`.

## Why this plan exists

The current site has begun to expose a structural gap: the UI can look complete while the loaded release catalogue is still partial. The autograph section made this obvious.

Earlier work intentionally used bounded pilots. That was appropriate for proving architecture, but BoxScout must now stop presenting pilot coverage as though it were the finished release.

The architecture is not being replaced. This plan completes the data layer the architecture was designed to support.

## Governing principles

- One canonical release catalogue.
- One checklist entry per reviewed release identity.
- Exact variants are separate records from checklist entries.
- Do not generate entry x parallel Cartesian products unless the source proves the relationship.
- Release membership does not imply configuration eligibility.
- Missing eligibility is UNKNOWN, never EXCLUDED.
- Unresolved source disagreement blocks canonical promotion for the affected record/family.
- AI may discover, extract and propose; deterministic validation plus review controls promotion.
- Stable existing IDs must be preserved unless a genuine identity collision requires an explicitly approved migration.
- No destructive overwrite of existing canonical data.
- Imports must remain deterministic, additive where appropriate, idempotent and rollback-safe.

## Source hierarchy

Use the existing project hierarchy:

1. Panini official checklist / manufacturer documentation
2. manufacturer-authored material distributed by an authorized distributor
3. established checklist databases
4. secondary sources for corroboration/discovery only

Preserve source identity and authority separately. A distributor-hosted manufacturer workbook is not the same thing as a Panini-hosted page, even if the underlying material originated with Panini.

Do not bypass access controls or use cached snippets as canonical row evidence.

## Required work

### 1. Establish the release subset inventory

Inspect the manufacturer/distributor workbook and build a reviewed inventory of every distinct checklist subset/family in the release.

For each subset record:

- canonical subset ID
- exact source name
- normalized display name
- category: BASE / VARIATION / INSERT / AUTOGRAPH / MEMORABILIA / OTHER / UNRESOLVED
- subject count
- whether a standard edition exists
- known parallel-family labels
- provenance
- review state
- discrepancy state

The inventory count becomes the denominator for completeness reporting.

### 2. Reconcile checklist entries

For every subset intended for canonical publication:

- extract exact card number/identifier
- display name
- subjects/players/teams
- multi-subject structure where applicable
- category
- provenance
- independent corroboration where practical

Do not force a single-player schema onto dual/trio/quad/team/badge/poster cards.

Substantive source disagreements go into an explicit discrepancy ledger. Preserve both source values and reviewed rationale.

### 3. Reconstruct exact variants

From reviewed source rows, create exact Variant records.

Required properties include:

- entry ID
- exact family/name
- standard vs parallel
- numbering state: NUMBERED / UNNUMBERED / UNKNOWN
- serial total when evidenced
- autograph/relic traits when evidenced
- provenance
- verification/review state

Do not infer a print run from color naming conventions.
Do not infer UNNUMBERED merely from a blank source cell without corroboration.
Do not assume a parallel exists for every entry in a subset.

### 4. Complete autograph coverage explicitly

Autographs receive a dedicated completeness audit because this is the first major visible failure.

At minimum, investigate all autograph families already observed in packaging/release sources, including:

- Signatures
- Penmanship
- International Ink
- Global Graphs
- National Heroes
- 2012 Prizm Throwback Signatures
- 1994 Team USA Signatures
- Dual Signatures
- Trio Signatures
- Quad Signatures
- Winning Captains
- Signature Moments

This list is a starting inventory, not authority that no other autograph subset exists.

For each autograph subset, determine:

- expected entry count
- imported entry count
- expected reviewed variant families where source data supports such a count
- imported variant count
- unresolved identities/numbering/exceptions

The UI must not call the autograph list complete until the autograph completeness gate passes.

### 5. Machine-readable completeness report

Generate a deterministic coverage artifact from canonical/review data, not hand-maintained prose.

Minimum output:

```text
release_subsets_expected
release_subsets_canonical
release_subsets_unresolved

entries_expected_or_source_observed
entries_canonical
entries_unresolved

variants_source_observed
variants_canonical
variants_unresolved

by category:
  base
  variation
  insert
  autograph
  other

by subset:
  source count
  canonical count
  unresolved count
  completion state
```

Where a true expected total cannot be established, label it UNKNOWN rather than manufacturing a denominator.

### 6. Publication gate

The publication process must refuse to label a section `complete` when its coverage report has unresolved or missing required records.

Recommended states:

- COMPLETE
- PARTIAL
- UNRESOLVED
- UNKNOWN_COVERAGE

These are coverage states, separate from evidence verification states.

### 7. Minimal UI honesty changes

This plan may make narrowly scoped frontend changes only where necessary to stop misleading presentation.

Examples:

- `Full checklist` -> `Checklist` when completeness is not established
- show `Partial coverage` / `X unresolved` where appropriate
- autograph section shows loaded/coverage state
- configuration-filtered views explain that release completeness and box eligibility are separate

Do not redesign the product page or card tiles in this plan.

## Explicitly out of scope

Do not implement:

- Product #2
- chase board / finite-instance tracking
- sale ingestion or card valuation
- sealed-market automation
- Compare Boxes
- affiliate links/monetization changes
- accounts/auth/cloud collection
- scanner/camera/native app work
- broad image acquisition
- speculative EV/value scores
- major frontend redesign
- full Mega eligibility completion beyond preserving existing reviewed claims

## Data-integrity requirements

- Existing canonical records remain stable.
- New import work must use expected-current-digest protection.
- Unexpected modification/removal of existing records fails the import.
- Transaction rollback must be tested.
- Re-running the same reviewed import must be a no-op.
- Candidate/raw data stays separate from reviewed canonical records.
- Discrepancies are preserved; no majority-vote auto-resolution.
- Source refresh must not silently change review dates, evidence states or canonical output.
- PostgreSQL remains canonical; the public app continues to consume an approved snapshot.

## Documentation cleanup

During this plan:

1. update `docs/PHASE_1_STATUS.md` with measured coverage;
2. update `docs/GOLDEN_PRODUCT.md` to distinguish complete vs unresolved release families;
3. update `docs/DATA_MODEL.md` only if implementation reveals a real missing concept;
4. update `docs/UI_SPEC.md` for coverage-state language if UI honesty changes are required;
5. keep Plans 001-009 as historical implementation records, not active authorization.

Do not perform a broad architecture rewrite merely to make documentation look cleaner.

## Acceptance criteria

Plan 010 is complete only when all are true:

1. Every distinct source subset/family in the reviewed manufacturer workbook has a recorded classification or explicit unresolved state.
2. Every resolvable checklist family approved for publication has deterministic canonical entries with provenance.
3. Exact variants are reconstructed from actual source rows/relationships; no unsupported Cartesian generation is used.
4. Every known autograph subset has an explicit coverage record and the public autograph section no longer implies unsupported completeness.
5. A deterministic machine-readable coverage report exists and is tested.
6. Public wording cannot say `complete/full` for a section whose coverage gate does not pass.
7. Release membership remains separate from configuration eligibility; this plan does not inflate Mega pullability.
8. Existing IDs, Owned/Watching state semantics, configuration records and reviewed price/provenance survive unchanged unless a separately reviewed migration is required.
9. Database import/update is idempotent, guarded against destructive drift and rollback-tested.
10. Approved publication snapshot is regenerated and parity-checked.
11. Lint, typecheck, application tests, database integration tests and production build pass.
12. Mobile smoke checks confirm no regressions in search, filtering, Owned/Watching and current set/box navigation.
13. Diff is reviewed, committed, pushed, remote branch verified and working tree clean.

## Stop conditions

Stop and request a decision rather than guessing if:

- manufacturer workbook structure contradicts the current identity model;
- a subset cannot be classified without inventing semantics;
- sources materially disagree on identity or numbering;
- stable IDs would need destructive changes;
- completing coverage requires bypassing access controls or violating source terms;
- the full release scale materially exceeds the architecture/performance assumptions;
- a new infrastructure service appears necessary.

## Next plan after completion

**Plan 011 — Resolve Exact Mega Identities, Pull Profiles and Configuration Eligibility**

Only after release-level catalogue coverage is trustworthy should BoxScout establish the supported Mega versions/configurations, any evidence-backed pull-profile equivalence, and exact variant eligibility for the shopper-facing Mega experience.
