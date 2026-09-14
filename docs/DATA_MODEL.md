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
