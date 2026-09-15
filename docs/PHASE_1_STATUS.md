# BoxScout Phase 1 Status

Last updated: 2026-09-15

## Authority

This document is the current operational source of truth for Phase 1 status and sequencing. It does not replace `PRODUCT.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, or `DATA_INTEGRITY.md`; it tells agents what is true now, what remains incomplete, and what to do next.

When older execution plans conflict with this document or the current active plan, follow this document plus the current active plan. Historical plans remain useful implementation history, not current authorization.

## Phase 1 mission

Build a mobile-first BoxScout web application that Justin genuinely uses before buying soccer-card sealed products.

BoxScout is a sealed-product intelligence product, not primarily a collection manager. The core asset is the trustworthy structured dataset and ingestion/review system underneath the UI.

Golden Product #1 remains:

**2026 Panini Prizm FIFA World Cup Soccer**

The immediate objective is not to add more products or more visual features. It is to make this release and one Mega configuration trustworthy end-to-end.

## Current architecture

The architecture remains healthy and should not be rewritten.

- Next.js / React / TypeScript mobile-first application
- modular monolith with domain and repository boundaries
- PostgreSQL / Supabase as canonical catalogue storage
- approved snapshot published through Git / Vercel
- no database requests required for catalogue browsing
- browser-local Owned / Watching state remains separate from canonical catalogue facts
- versioned migrations, reviewed imports, provenance, integrity constraints, tests and recovery procedures exist

The intended data pipeline remains:

```text
external sources
  -> raw observations
  -> normalized candidates
  -> validation / discrepancy review
  -> reviewed canonical records
  -> PostgreSQL
  -> approved publication snapshot
  -> BoxScout UI
```

AI may discover or propose data. AI must not silently promote evidence into canonical fact.

## Current Golden Product state

The loaded catalogue is materially more complete than the original pilot, but it is **not yet a complete release catalogue**.

Latest reviewed Plan 009 state:

- 1,010 checklist entries
- 10,342 variants
- 13,807 configuration/variant links
- nine configurations
- all original pilot records preserved
- full coverage still pending for disputed or unresolved subset families

Earlier release inspection estimated roughly 1,400-1,600 checklist entries and 50,000-60,000 exact variants across the full release. Those figures are a planning envelope, not canonical counts. Final totals must be derived from reviewed source data.

The current website must therefore never imply that the loaded catalogue is the complete release unless a completeness gate has actually passed.

## Known gaps / risks

### 1. Release catalogue completeness

The largest current issue. Some autograph, insert and parallel families remain absent or unresolved. The autograph UI exposed this gap visibly.

### 2. Configuration eligibility completeness

Release membership and box eligibility are different facts. An entry or variant existing in the release does not prove it is pullable from a specific Mega, Hobby, Target, NPP, DSG or other configuration.

Missing eligibility means UNKNOWN, not EXCLUDED.

### 3. UI completeness language

The UI needs explicit coverage states so a partial section cannot masquerade as a full checklist.

### 4. Documentation drift

Plans 001-009 contain valuable history but no longer form a clean active roadmap. The current active plan is Plan 010. Future work must follow one active plan at a time.

### 5. Image rights / coverage

The image pipeline is rights-aware, but broad public image coverage is not established. Manufacturer outreach to Panini and Topps is in progress. Missing imagery must remain an intentional placeholder until rights and exact-match requirements are satisfied.

### 6. Backup maturity

Catalogue backups remain manual/local. Off-device scheduled backups are required before BoxScout stores irreplaceable reviewed evidence, sales history or finite-instance data.

## Product model that must remain explicit

```text
Release
  -> ChecklistEntry
      -> Variant
          -> future FiniteInstance
              -> future SurfaceObservation
                  -> Evidence

Release
  -> Configuration

Configuration <-> VariantEligibility
```

Three questions must never be collapsed:

1. What checklist entries exist in the release?
2. What exact variants of each entry exist?
3. Which exact variants are eligible in a particular sealed configuration?

The frontend consumes those answers; it does not invent them.

## Current development freeze

Until Plan 010 is complete, do not add:

- Product #2
- new monetization features
- affiliate implementation
- subscriptions
- accounts/auth
- scanner/camera features
- new native-app work
- speculative EV/value scores
- broad Compare work
- chase depletion implementation
- sales-market ingestion
- major new UI surfaces unrelated to honest coverage/completeness

Small UI changes required to expose data coverage accurately are allowed by Plan 010.

## Recovery roadmap

### Plan 010 — Complete Golden Product release catalogue

Current active plan. Establish the authoritative release universe, complete resolved checklist families and exact variants, expose machine-readable coverage, and prevent incomplete sections from being presented as complete.

### Plan 011 — Complete Mega configuration eligibility

After the release universe is trustworthy, finish the evidence-backed mapping from exact variants to the selected shopper-facing Mega family/version(s). Preserve version-specific differences internally.

### Plan 012 — Golden Product frontend refinement

Once the underlying data is trustworthy, refine the product/checklist/autograph/variant browsing experience to match Justin's intended mobile UX.

### Plan 013 — Chase and finite-instance foundation

Implement Variant -> FiniteInstance -> SurfaceObservation -> Evidence for selected meaningful finite chases. Never infer that an unobserved copy remains sealed.

### Plan 014 — Market and sales intelligence

Collect and normalize supported sales and current sealed-price evidence with provenance, grade, serial, venue, currency, date and sale type.

### Plan 015 — Compare Boxes

Only after at least two products/configurations have defensible data. Use transparent metrics; do not claim rigorous EV without sufficient evidence.

Product #2 begins only after Golden Product #1 is useful end-to-end and Justin would genuinely use it before a purchase.

## Quality bar

BoxScout should optimize for trust before breadth.

A correct UNKNOWN is better than a confident guess.
A partial section labelled partial is better than a fake full checklist.
One complete Golden Product is better than ten shallow products.
The canonical database and its provenance are more important than decorative frontend completeness.

## Immediate next action

Execute `docs/exec-plans/active/010-complete-golden-product-release-catalogue.md` before any further product expansion or major UI work.
