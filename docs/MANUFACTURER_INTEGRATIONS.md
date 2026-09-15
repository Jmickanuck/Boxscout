# BoxScout Manufacturer Integration Strategy

Last updated: 2026-09-15

## Purpose

This document defines the approved manufacturer-facing product direction for BoxScout, initially focused on companies such as Topps/Fanatics and Panini.

The goal is not to turn BoxScout into a manufacturer-controlled catalogue or a B2B product first. The collector remains the primary user. The manufacturer strategy exists because BoxScout can become a high-quality downstream surface where official product information, imagery and purchase destinations are represented accurately at the moment collectors are making sealed-product decisions.

Core strategic framing:

> BoxScout should be easy for a manufacturer to work with, safe for a manufacturer to supply assets/data to, and measurably useful as a collector discovery and purchase-intent surface.

This is approved long-term implementation direction. It does not replace the current active execution plan or authorize skipping Golden Product data-quality work.

## Strategic objectives

BoxScout should evolve toward a system that can:

1. receive official manufacturer assets and structured product information safely;
2. preserve exact rights, attribution, provenance and withdrawal controls;
3. clearly distinguish manufacturer-supplied facts from BoxScout research/analysis;
4. let manufacturers review how their products are represented and submit corrections without directly editing canonical production data;
5. direct collectors toward official stores and credible/authorized retailers when appropriate;
6. measure aggregate outbound purchase-intent traffic without compromising collector privacy;
7. support private previews, scheduled launches and embargoed manufacturer content when trust and operations are mature enough;
8. eventually provide useful aggregate product-interest analytics to participating manufacturers;
9. keep BoxScout editorial/analytical independence intact regardless of manufacturer participation, commercial relationships or affiliate economics.

## Principle 1 — Manufacturer asset and rights management

BoxScout already separates exact image matching from publication permission. Expand this into a first-class rights model.

Manufacturer-supplied or licensed assets should eventually support metadata such as:

- asset owner / licensor;
- manufacturer;
- source / source reference;
- exact covered release, configuration, card, variant or broader scope;
- permission status;
- allowed surfaces / uses;
- territory if restricted;
- start date / expiry date where applicable;
- required attribution text;
- transformation rights, such as resize/crop/thumbnail permissions;
- approval or agreement reference;
- date received;
- last reviewed date;
- withdrawal state / date;
- internal notes stored outside public Git when sensitive.

Suggested public-safe lifecycle values:

- `PENDING_REVIEW`
- `PUBLIC_ALLOWED`
- `RESTRICTED`
- `EXPIRED`
- `WITHDRAWN`

Exact naming may change when implemented, but the semantics must remain explicit.

### Withdrawal requirement

A manufacturer-approved asset must be removable deterministically. A withdrawal process should be able to:

1. identify every published derivative and surface using the asset;
2. remove or replace it from the approved publication inventory;
3. regenerate/deploy affected public snapshots/pages;
4. verify that current public routes no longer expose it;
5. retain only the internal provenance/rights record required for audit/recovery.

Do not promise immediate purge from immutable third-party caches or historical Git unless the architecture truly supports it. Scope claims to the systems BoxScout controls.

## Principle 2 — Official-source attribution in the collector UI

BoxScout should clearly separate official manufacturer information from BoxScout-generated or third-party intelligence.

Examples of manufacturer-sourced facts:

- official checklist rows;
- official box/configuration specifications;
- published odds;
- manufacturer guarantees or per-box averages;
- official product imagery;
- release dates;
- official SKUs/UPCs;
- official purchase destinations.

Examples of BoxScout intelligence:

- normalized configuration relationships;
- observed sealed-market pricing;
- recent card sales;
- verified surfaced finite-card evidence;
- chase-landscape analysis;
- comparisons;
- future value modelling.

The frontend should eventually support a small, consistent attribution/evidence system such as:

- `OFFICIAL SOURCE`
- `BOXSCOUT VERIFIED`
- `REPORTED`
- `UNKNOWN`

Do not use manufacturer branding in a way that implies endorsement or partnership unless such a relationship exists.

## Principle 3 — Manufacturer preview and correction workflow

BoxScout should provide a controlled way for a manufacturer to review how a release/configuration is represented and submit corrections or replacement assets.

Initial implementation can be an internal/admin workflow rather than a self-service portal.

Potential review areas:

- release identity;
- box formats;
- exact configurations/SKUs;
- checklist coverage;
- parallels/variants;
- published odds and guarantee wording;
- official imagery;
- official purchase links;
- attribution language.

Manufacturer submissions must enter the same evidence workflow as any other source:

```text
manufacturer submission
-> raw/candidate record
-> validation / discrepancy review
-> reviewed canonical record
-> approved publication
```

A manufacturer must never receive unrestricted direct write access to canonical BoxScout facts merely because it owns the underlying brand/product. BoxScout remains responsible for the integrity of what it publishes.

## Principle 4 — Official and authorized purchase paths

Where useful to collectors, BoxScout should be able to show:

1. an official manufacturer store destination when available;
2. participating/authorized retailers where manufacturer status can be supported;
3. other credible retailer offers under BoxScout's normal retailer-quality rules.

The presence, prominence or ranking of an offer must not be determined by affiliate commission or commercial consideration.

Future outbound-link observations may record:

- source BoxScout page / configuration;
- destination class (official store / authorized retailer / other retailer);
- destination domain / retailer ID;
- timestamp;
- aggregate click count;
- campaign/release context where appropriate.

Avoid collecting unnecessary personal identity data. Manufacturer reporting should default to aggregate product-interest and outbound-click metrics.

## Principle 5 — Structured manufacturer intake

BoxScout should eventually accept manufacturer data in a repeatable supervised intake workflow rather than building every product manually.

Target information model may include:

```text
Release
├── manufacturer
├── release date
├── product identifiers
├── Box Formats
│   └── Configurations / SKUs / UPCs
├── packs / cards
├── checklist
├── variants / parallels
├── configuration eligibility
├── published odds
├── guarantees / averages
├── official product imagery
├── official card imagery
├── official purchase URLs
└── rights / attribution metadata
```

Acceptable intake forms may eventually include CSV, XLSX, JSON, manufacturer feeds or reviewed PDFs. BoxScout should normalize these into the existing candidate/review/canonical pipeline rather than creating a parallel source of truth.

## Principle 6 — Private preview, embargo and launch support

This is a later capability and must not be implemented casually.

Potential lifecycle:

- `PRIVATE_DRAFT`
- `EMBARGOED`
- `APPROVED`
- `SCHEDULED`
- `PUBLIC`

A mature implementation must support:

- manufacturer-specified embargo timestamps;
- access controls preventing public publication before the embargo;
- deterministic scheduled publication;
- auditable approval state;
- rollback/removal;
- no leakage through generated snapshots, public routes, sitemaps, previews, search indexes or asset URLs.

Do not accept confidential or embargoed manufacturer data until BoxScout has adequate access control, secret handling, backups and operational maturity.

## Principle 7 — Manufacturer analytics

Only after BoxScout has meaningful traffic should manufacturer-facing aggregate analytics become a product priority.

Potential metrics:

- product/release views;
- box/configuration views;
- comparison frequency;
- search interest;
- watched chase/card interest where privacy-safe and statistically appropriate;
- outbound official-store clicks;
- outbound authorized-retailer clicks;
- price-point engagement;
- release-interest trends over time.

Never sell or expose individual collector behaviour as part of this feature. Prefer aggregated, thresholded reporting where needed to protect privacy.

## Principle 8 — Editorial independence and conflicts

Manufacturer participation must not compromise BoxScout trust.

Rules:

- manufacturer-supplied data is attributed, not treated as an endorsement of BoxScout analysis;
- manufacturer relationships do not change evidence states;
- affiliate commission is never a ranking factor;
- sponsored placement, if ever introduced, must be explicitly labelled and separate from rankings/recommendations;
- a manufacturer cannot pay to suppress verified market/surfaced evidence merely because it is commercially inconvenient;
- factual corrections are welcome and should be processed quickly when supported;
- BoxScout analysis should remain inspectable and evidence-backed.

## Approved implementation sequence

These capabilities are approved direction, but should be staged so they strengthen rather than derail the current product.

### Stage M0 — Foundation compatible with current work

May be designed or implemented when it naturally touches active work:

- explicit manufacturer/source attribution in data records and UI patterns;
- richer asset-rights metadata model;
- deterministic asset withdrawal inventory/procedure;
- clear official-source vs BoxScout-intelligence semantics;
- manufacturer source type in provenance where not already represented.

These are architectural/data-integrity foundations and should be incorporated opportunistically without skipping Plan 010.

### Stage M1 — Manufacturer-ready product presentation

After core Golden Product identity/coverage is trustworthy:

- official-source badges/attribution on relevant product facts;
- official purchase destination support;
- manufacturer-facing preview page/export for a release;
- structured correction/replacement-asset intake handled through BoxScout review;
- audit trail for corrections and rights changes.

### Stage M2 — Structured partner intake

After the supervised Add Product workflow is mature:

- standardized manufacturer import template;
- automated validation/discrepancy reports;
- configuration/SKU and checklist ingest;
- rights-aware asset intake;
- pre-publication preview and approval review.

### Stage M3 — Purchase-intent measurement

After meaningful traffic and appropriate privacy/analytics infrastructure exist:

- outbound-click measurement;
- official-store vs retailer destination classification;
- aggregate release/configuration interest metrics;
- manufacturer reporting/export.

### Stage M4 — Launch/embargo collaboration

Only after access control and operational maturity are proven:

- private manufacturer workspace or equivalent controlled workflow;
- embargo state and scheduled publication;
- launch-day release packages;
- strict leakage tests and rollback procedures.

### Stage M5 — Manufacturer intelligence products

Only after there is demonstrated value and sufficient traffic:

- aggregate manufacturer dashboards;
- release/format comparison interest;
- product discovery and purchase-intent trends;
- optional B2B/API/data products consistent with BoxScout's independence and privacy rules.

## Near-term implementation candidates

The following should be treated as the first manufacturer-readiness items to convert into execution-plan work when sequencing permits:

1. define the canonical rights/asset-permission schema;
2. define manufacturer/source attribution fields and UI vocabulary;
3. implement an asset inventory that can answer "where is this asset published?";
4. document and test a withdrawal/removal procedure;
5. create a manufacturer preview/export view using the actual BoxScout UI;
6. create a reviewed correction/submission workflow, initially internal/admin;
7. support official-store URLs independently from generic retailer offers;
8. design privacy-safe outbound-click event semantics before collecting analytics.

## Acceptance criteria for manufacturer readiness

Before BoxScout actively markets itself as manufacturer-integration ready, it should be able to demonstrate that:

- an official asset has an explicit provenance and rights record;
- the UI identifies manufacturer-sourced facts without implying endorsement;
- an incorrect manufacturer fact can be corrected through a reviewed workflow;
- a withdrawn asset can be located and removed from BoxScout-controlled public surfaces;
- official purchase URLs are represented separately from observed third-party retailer offers;
- manufacturer-supplied data cannot bypass canonical validation/review;
- private/embargoed data is not accepted until the security model can actually protect it;
- commercial relationships cannot silently influence rankings or factual analysis.

## Relationship to current roadmap

The current active execution plan remains Plan 010. This document creates approved future implementation requirements; it is not permission to interrupt or bypass the Golden Product recovery sequence.

When manufacturer-readiness work becomes active, create a dedicated execution plan with explicit dependencies on the then-current catalogue, identity, UI, security and analytics state. Keep one active execution authority at a time unless the repository workflow is deliberately changed and documented.

## Related documents

- `PRODUCT.md`
- `PHASE_1_STATUS.md`
- `DATA_INTEGRITY.md`
- `MANUFACTURER_PITCH_DECK_BRIEF.md`
- `MONETIZATION.md`
- `AI_CONTEXT.md`
