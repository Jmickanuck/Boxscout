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
