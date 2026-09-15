# BoxScout Data Model — Phase 1 Direction

The model should distinguish:

```text
Release
  → Configuration/SKU
  → eligible variants

Release
  → Cards
  → Variants
  → Images
  → Finite Instances
  → Market Observations
```

## Release

Example:
2026 Panini Prizm FIFA World Cup

Suggested fields:
- id
- year
- manufacturer
- brand
- name
- sport
- release_date
- base_card_count
- verification/provenance metadata

## Configuration

Examples:
NPP Mega, Hobby, Choice, DSG Mega

Suggested fields:
- id
- release_id
- name
- sku/upc where known
- packs_per_box
- cards_per_pack
- cards_per_box
- verification status
- sources

## Card

Checklist identity.

Suggested fields:
- id
- release_id
- card_number
- player_name
- team_or_country
- subset
- card_type
- sort_order

## Variant

A version/parallel of a card.

Suggested fields:
- id
- card_id
- parallel_name
- serial_total nullable
- autograph/relic flags
- configuration eligibility
- provenance

## Configuration Variant Eligibility

Do not infer that a variant is pullable from every configuration merely because it exists in the release.

Suggested relationship:
- configuration_id
- variant_id or variant family identifier
- eligibility status
- source

## Box Content Rule

Suggested fields:
- configuration_id
- item_type
- quantity or odds
- claim_semantics
- source

Claim semantics:
- GUARANTEED
- PER_BOX_AVERAGE
- PUBLISHED_ODDS
- POSSIBLE

## Card Image

Suggested fields:
- id
- card_id
- variant_id nullable
- original_url
- stored_asset_url nullable
- source_url
- source_name
- image_match_status
- usage_status
- image_type
- width
- height
- format
- is_primary

## Market Observation

Suggested fields:
- target entity reference
- observation_type
- price
- currency
- date
- source
- listing/sale status

## Finite Instance

For an individually numbered physical card.

Example:
Messi Red Disco 37/99

Suggested fields:
- variant_id
- serial_number
- serial_total
- surfaced_status
- confidence
- observed_date

Database constraint when implemented:
serial_number <= serial_total

## Evidence

Suggested fields:
- id
- target reference
- source
- source_url
- observed_date
- evidence_type
- notes
- verification_state

## Local Collection State

Phase 1:
- card_id
- owned boolean
- watched boolean

Initially stored in browser-local persistence behind a repository abstraction.

## Database direction

Use PostgreSQL when persistent canonical storage is introduced.

Canonical catalogue data is relational and should benefit from relational constraints.

Do not select a document database merely because it is easy to prototype.


## Implemented Plan 002 refinement

- RetailerListing keeps Mastermind SKU, reported UPC, and storefront variant identifier distinct from Configuration manufacturer identity. Identifiers are strings with evidence references. Existing Configuration.sku/upc and scalar pack counts remain null while candidate specifications are shown with qualified applicability.
- SourceEvidence extends Provenance with source kind, source locator, source wording/summary, qualification, optional precise observation time and ID. Authority order is Panini official, official manufacturer/distributor sell sheet, exact-identifier retailer, secondary source. Evidence lifecycle describes the observation; it never alone verifies exact-box applicability.
- ConfigurationLink records exact-UPC/family linkage separately from matching contents, family-only facts or release-only evidence. The reviewed assessment is bounded by supporting evidence; retailer links yield at most PROBABLE. VERIFIED requires both an explicit reviewed decision and a verified authoritative UPC/family bridge. Conflicting explicit family assignments produce UNKNOWN.
- PackagingSpecification records packs/cards and optional source-stated total; disagreements stay unresolved. BoxContentClaim records matching-UPC versus family scope, source, quantity, semantics (nullable), published odds (nullable), included subcounts, conflict IDs and qualifications. Average and guarantee records coexist. Grouped counts are not added to headline totals. No individual-card eligibility is inferred.
- SealedPriceObservation stores integer minor units, explicit currency, listing/product IDs, UTC observedAt, LISTING_PRICE/ONE_SEALED_BOX, availability, tax/shipping states and provenance. Actual observations are appended even when unchanged. The domain selects latest verified, valid, nonfuture matching-listing CAD data; equal-time conflicts yield no single quote. No delivered-total or sale-value inference.
- These small readonly local records remain separate from browser-local Owned/Watching state. Catalogue repository access and pure domain selection preserve the modular-monolith boundary. No ingestion or database layer was added.


## Implemented Plan 003 checklist boundary

Card retains release ID, stable card ID, number, player, country, subset and numeric sort order. It now carries an explicit verificationState, checkedAt and discrepancyIds. Provenance may include sourceId and a source row/section locator. The import manifest holds source authority, retrieval time and hashes; the review ledger preserves source-specific factual differences. Source extracts and review history are development data, not user collection state. Runtime fixtures are generated only after complete coverage, corroboration, resolution and legacy-identity checks pass.

Card → Variant → FiniteInstance remains the direction for future work. A base card ID never identifies a copy, user, grade, serial number or price observation. Collection entries/quantities, user accounts and later observations should reference canonical entities through separate repositories; no speculative fields or those features are added now. No chase score, EV or configuration eligibility is derived from checklist membership.


## Implemented Plan 004 image boundary

ImageAsset has a stable ID, release/card ID, nullable future variant ID, FRONT/BACK side, source name/page/original URL, checked date, match state/rationale, usage state/rationale, approval state, reviewer/date, explicit primary flag, grant evidence/scope, optional credit, local input reference/hash and nullable known dimensions/format. Candidate/reference records may have no binary. Separate discovery references can remain unassigned until an exact card target is established.

Match states retain CANDIDATE/REVIEWED/VERIFIED/MISSING. Usage states retain INTERNAL_REFERENCE/PUBLIC_ALLOWED/USER_SUBMITTED/OWNED_ASSET/UNKNOWN_RIGHTS. Approval is independently PENDING/APPROVED/REJECTED/WITHDRAWN. Only VERIFIED + PUBLIC_ALLOWED + APPROVED, with explicit non-expiring web/derivative/repository permission, can produce public files in this static pilot. Ownership/submission alone never grants publication.

The generated PublicImage contains approved identity/side, path, dimensions/format, content hash/bytes and public credit/source link; no original URLs or review history. Only one explicit primary per card/variant/side is allowed. Base selection requires variantId null and FRONT; null means base, not every parallel. Variant references must resolve to a known target; none exist in this pilot. Card.image remains a compatible projection so generated checklist rows and local state are untouched.

Future user/account collection entries should reference variants and, when applicable, finite instances, with separate quantity/grade/ownership details. Recent-sale observations and valuation history must distinguish sale evidence from asking prices and retain date/currency/confidence. Release/configuration collection value requires explicit eligible membership and no double-counting. Canonical images may be reused as evidence references but do not establish ownership, physical-instance uniqueness or a completed sale.

## Implemented Plan 005 identity foundation

Release → ChecklistEntry → Variant is separate from Configuration ↔ VariantEligibility. ChecklistEntry extends the existing Card identity without renaming the 500 base IDs. It classifies BASE, INSERT, AUTOGRAPH, RELIC, MEMORABILIA, VARIATION or OTHER; current pilot includes no relics. Variations link to their base entry; Aces and Team USA signatures have independent subset/number identities. A future multi-subject entry remains one checklist identity.

Variant is the collectible type, not a physical copy. Messi Red Disco /99 has serialTotal 99 and one variant record. No 03/99 or 18/99 instances are generated now. NUMBERED, UNNUMBERED and UNKNOWN are distinct; no inferred total from SSP wording. Per-entry autograph totals override any tempting family-wide assumption.

Default variant IDs equal entry IDs, an explicit separate-entity identity convention. Existing boxscout:collection:v1 keys therefore designate Base/default variants without rewriting data. Parallel IDs append a stable edition suffix; they never include the correctable serial total or configuration. Canonical entries and personal flags remain independent, even where identifiers share the same string. No 'variant unspecified' migration occurs.

Eligibility claims reference exact variants and configurations, with status, confidence, source references, checked date, locator and rationale. Absence means UNKNOWN. Contradictions cannot render as included. Mastermind-to-NPP confidence remains independently PROBABLE and caps displayed exact-box confidence. Eight release configuration records do not add eight retailer products. Existing Plan 002 Configuration remains the unresolved retailer-linked product; the release registry is separate.

Images join entry/cardId plus exact variantId. Legacy null-variant base images are compatible only with Base/default editions. Image validation now recognizes all approved pilot entry/variant targets. Match and publication rights remain independent.

Deferred: user CollectionEntry → Variant with quantity, optional serial instance, condition, raw/graded status, company/grade and purchase price. Sales observations and valuation history remain separate, supporting later collection value by release/configuration without duplicate counting. Variant → FiniteInstance → SurfaceObservation → Evidence supports verified surfaced copies, deduplication and configuration-specific remaining-chase analysis. None of those records/features is implemented by Plan 005.

## Implemented Plan 006 relational catalogue

The `catalogue` schema stores releases, retailer configuration assessments, products, entries, variants, configuration families, eligibility, sources/evidence, listings, source-scoped configuration links/specifications/claims, dated sealed prices and ordered provenance/conflict junctions. Core identities and serial totals are typed relational columns; source-specific qualifiers/provenance/ordered subcounts retain JSON without flattening uncertainty. All original IDs and source hashes survive database round-trip. See versioned db/migrations and the persistence runbook.

`imports` records the initial reviewed input digest; `publications` independently records approved content digests. Importing a fact does not make it public. Default variant IDs remain equal to entry IDs; no Owned/Watching upload or migration occurs. The initial uniqueness rule uses release/subset/printed number and parent/parallel name for this verified pilot; a future genuinely ambiguous identity requires an additive discriminator migration, never silent deduplication.

Future FiniteInstance references Variant with unique variant/serial ordinal and a parent-total constraint; SurfaceObservation links that instance to Evidence. Market observations, valuations, account collections/watchlists and retailer commercial relationships remain separate future entities. No future-domain tables are created now. Future variant detail services can compose these by stable variant ID without duplicating canonical checklist entries per configuration.
