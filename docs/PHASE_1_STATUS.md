# BoxScout Phase 1 Status

Last updated: 2026-09-15

## Authority

This document is the current operational source of truth for Phase 1 status and sequencing. It does not replace `PRODUCT.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `DATA_INTEGRITY.md`, `BOX_FIRST_UI_DIRECTION.md`, or `MANUFACTURER_INTEGRATIONS.md`; it tells agents what is true now, what remains incomplete, and what to do next.

When older execution plans conflict with this document or the current active plan, follow this document plus the current active plan. Historical plans remain useful implementation history, not current authorization.

## Phase 1 mission

Build a mobile-first BoxScout web application that Justin genuinely uses before buying soccer-card sealed products.

**Primary product rule:** BoxScout is a sealed-box buying intelligence application. The main user question is **which box should I buy, what should I pay, and where should I buy it?** Card/checklist data exists to support that decision with trustworthy evidence.

BoxScout is not primarily a collection manager or checklist database. The core asset is the trustworthy structured dataset and ingestion/review system underneath the UI.

Golden Product #1 remains:

**2026 Panini Prizm FIFA World Cup Soccer**

The immediate objective is not to add more products or more visual features. It is to make this release and one Mega box family/configuration trustworthy end-to-end.

The 2026-09-15 live-site audit is captured in `PRODUCT_AUDIT_2026-09-15.md`; durable box-first UI requirements are in `BOX_FIRST_UI_DIRECTION.md`.

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

### 3. Box identity / grouping clarity

The live audit showed that the current Mega presentation can blur box format, exact box version/configuration, retailer listing and card subset terminology. Plan 011 must resolve exact identities and any evidence-backed pull-profile groupings before the frontend presents versions as equivalent.

### 4. UI completeness language

The UI needs explicit coverage states so a partial section cannot masquerade as a full checklist or complete box intelligence.

### 5. Documentation drift

Plans 001-009 contain valuable history but no longer form a clean active roadmap. The current active plan is Plan 010. Future work must follow one active plan at a time.

### 6. Image rights / coverage

The image pipeline is rights-aware, but broad public image coverage is not established. Manufacturer outreach to Panini and Topps is in progress. Missing imagery must remain an intentional placeholder until rights and exact-match requirements are satisfied.

### 7. Sealed-price intelligence is still shallow

The box-first product vision requires average/typical market price, credible retailer comparisons, completed sealed-sale evidence and history. Current price observations are only a foundation, not a complete market model. This work belongs primarily to Plans 012 and 014 after identity/eligibility are trustworthy.

### 8. Chase surfaced/depletion data is not implemented

The long-term box-buying value proposition depends on verified finite-card surfaced evidence. This remains a later approved domain; do not fake `remaining` counts from absence of public evidence.

### 9. Backup maturity

Catalogue backups remain manual/local. Off-device scheduled backups are required before BoxScout stores irreplaceable reviewed evidence, sales history or finite-instance data.

## Product model that must remain explicit

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

A future internal Pull Profile may group exact configurations only when evidence establishes materially equivalent pull structure. It never replaces exact canonical configuration identity.

Four questions must never be collapsed:

1. What checklist entries exist in the release?
2. What exact variants of each entry exist?
3. Which exact variants are eligible in a particular sealed configuration?
4. Which exact retailer listing/offer corresponds to that configuration and at what observed price?

The frontend consumes those answers; it does not invent them.

## Approved manufacturer-readiness direction

BoxScout should become increasingly easy and safe for manufacturers such as Topps/Fanatics and Panini to work with while preserving collector-first product priorities and BoxScout editorial independence.

The approved direction is documented in `MANUFACTURER_INTEGRATIONS.md` and includes:

- explicit official-source attribution;
- richer manufacturer asset-rights metadata;
- deterministic asset withdrawal/removal procedures;
- reviewed manufacturer corrections and replacement-asset submissions;
- official-store purchase destinations represented separately from ordinary retailer offers;
- future structured manufacturer imports;
- future privacy-safe outbound purchase-intent analytics;
- future private preview/embargo/launch workflows only after security and operational maturity support them;
- future aggregate manufacturer analytics only after meaningful traffic exists.

### What may be incorporated during current work

If Plan 010 or immediately adjacent data work naturally touches provenance, source type, image rights or publication inventory, it is acceptable to design those fields so they are compatible with the manufacturer-integration requirements. Do not create throwaway structures that will immediately need replacement.

### What must wait for later execution plans

Do not interrupt Plan 010 to build a self-service manufacturer portal, analytics dashboard, embargo system, large partner API or other major B2B surface. Those capabilities are approved, but their implementation must be sequenced after their data/security dependencies are ready.

## Current development freeze

Until Plan 010 is complete, do not add:

- Product #2
- new monetization features
- affiliate implementation
- subscriptions
- accounts/auth
- scanner/camera features
- new native-app work
- speculative EV/fair-value scores
- broad Compare work
- chase depletion implementation
- sales-market ingestion
- major new UI surfaces unrelated to honest coverage/completeness
- self-service manufacturer portals
- manufacturer analytics dashboards
- confidential/embargoed partner workflows

Small UI changes required to expose data coverage accurately are allowed by Plan 010. Manufacturer-readiness foundations that naturally intersect current provenance/rights/publication work may also be designed compatibly, but must not displace the active plan.

## Recovery roadmap

### Plan 010 — Complete Golden Product release catalogue

Current active plan. Establish the authoritative release universe, complete resolved checklist families and exact variants, expose machine-readable coverage, and prevent incomplete sections from being presented as complete.

### Plan 011 — Resolve exact Mega identities, pull profiles and configuration eligibility

After the release universe is trustworthy, establish exact Mega box versions/configurations, preserve retailer identifiers/listings separately, group only evidence-backed equivalent pull profiles, and finish the mapping from exact variants to the supported Mega version(s).

### Plan 012 — Box-first frontend and pricing presentation refinement

Implement the audited product hierarchy and mobile UX in `BOX_FIRST_UI_DIRECTION.md`: dashboard-style homepage, box-format/version comparison, box-first overview, clearer terminology and stronger retailer/price presentation. This is not permission to invent market data that Plan 014 has not yet established.

### Plan 013 — Major chase and finite-instance surfaced tracking

Implement Variant -> FiniteInstance -> SurfaceObservation -> Evidence for selected meaningful finite chases. Never infer that an unobserved copy remains sealed.

### Plan 014 — Card sales plus sealed-price market intelligence

Collect and normalize supported card sales and sealed-product price evidence with provenance, grade/serial where relevant, venue, currency, date, sale/listing type and historical observations. Distinguish asking/listing prices from completed sales.

### Plan 015 — Box comparison and first transparent value model

Compare supported boxes using inspectable metrics: sealed price, hit structure, eligible chase value, surfaced finite evidence and other defensible inputs. Begin with transparent comparative metrics; only model a fair-value range when the probability and market assumptions support it. No opaque BoxScout score or fake EV.

Product #2 begins only after Golden Product #1 is useful end-to-end and Justin would genuinely use it before a purchase.

Manufacturer-readiness work should be converted into a dedicated execution plan when the appropriate dependencies are ready. Near-term candidates are the canonical rights schema, official-source attribution, publication asset inventory/withdrawal workflow, manufacturer preview/export and reviewed correction intake.

## Quality bar

BoxScout should optimize for trust before breadth.

A correct UNKNOWN is better than a confident guess.
A partial section labelled partial is better than a fake full checklist.
One complete Golden Product is better than ten shallow products.
The canonical database and its provenance are more important than decorative frontend completeness.
The box-buying decision is the product; card data is the intelligence that makes that decision trustworthy.
Manufacturer participation must improve data quality and product presentation without buying influence over BoxScout analysis.

## Immediate next action

Execute `docs/exec-plans/active/010-complete-golden-product-release-catalogue.md` before any further product expansion or major UI work.
