# BoxScout Data Integrity Rules

Trust is a product feature.

## Rule 1 — Never invent data

Unknown is valid.

Examples:
- unpublished odds → UNKNOWN
- uncertain card match → CANDIDATE
- questionable pull evidence → REPORTED/PROBABLE
- no reliable sale → no fabricated market price
- uncertain configuration match → PROBABLE

## Rule 2 — Evidence states

Use explicit lifecycle states:

- RAW / CANDIDATE
- REVIEWED
- VERIFIED

AI discovery cannot directly promote uncertain evidence to verified fact.

## Rule 3 — Public surfaced language

Preferred:
- Verified surfaced
- Probable
- Reported
- No verified public evidence

Do not say a finite card is definitely “still live” merely because no public evidence was found.

## Rule 4 — Preserve claim semantics

Keep separate:

- GUARANTEED
- PER_BOX_AVERAGE
- PUBLISHED_ODDS
- POSSIBLE

Never convert “1 numbered card per box on average” into “1 numbered card guaranteed.”

## Rule 5 — Provenance

Important factual records should preserve:
- source
- source URL
- date checked/observed
- verification state
- confidence where applicable

Manufacturer-supplied data is a high-quality source type, not a bypass around provenance or review. Preserve the manufacturer/source identity and exact supplied claim semantics.

## Rule 6 — Raw before canonical

Future ingestion:

```text
source
→ raw record
→ normalized candidate
→ deterministic validation
→ review if needed
→ canonical promotion
```

Never:

```text
AI guesses
→ canonical record overwritten
```

Manufacturer submission follows the same pattern:

```text
manufacturer submission
→ raw/candidate record
→ validation / discrepancy review
→ reviewed canonical record
→ approved publication
```

A manufacturer must not receive unrestricted direct write access to canonical BoxScout facts merely because it owns the underlying brand/product.

## Rule 7 — Image integrity

Match accuracy and publication rights are different concepts.

Suggested image match states:
- CANDIDATE
- REVIEWED
- VERIFIED
- MISSING

Suggested usage states:
- INTERNAL_REFERENCE
- PUBLIC_ALLOWED
- USER_SUBMITTED
- OWNED_ASSET
- UNKNOWN_RIGHTS

Do not automatically republish marketplace photos merely because they are publicly viewable.

### Manufacturer asset-rights records

Manufacturer-supplied or licensed assets should eventually preserve, where applicable:

- owner / licensor;
- manufacturer;
- source reference;
- exact covered release/configuration/card/variant or broader scope;
- allowed public surfaces/uses;
- territory restrictions;
- start/expiry dates;
- required attribution;
- permitted transformations such as resize/crop;
- approval/agreement reference;
- date received / date last reviewed;
- withdrawal status/date.

Sensitive contracts, emails or private approval evidence should not be committed to public Git. Public records should contain only the minimum safe metadata needed to enforce publication.

A published asset must be traceable to every BoxScout-controlled derivative/surface that uses it so withdrawal can be handled deterministically.

## Rule 8 — Deterministic identity checks

Where applicable, validate:
- year
- manufacturer
- set
- subset
- player
- card number
- parallel
- serial total
- serial number
- configuration eligibility
- source quality

## Rule 9 — Canonical vs personal data

Canonical facts must never be mixed with user-specific state.

Owned/Watching is personal state, not catalogue truth.

## Rule 10 — No fake precision

Do not produce EV, probability, market value, or chase-depletion metrics beyond what the source quality supports.

## Rule 11 — Official-source attribution is not endorsement

BoxScout should distinguish manufacturer-supplied facts from BoxScout research/analysis in both data and UI semantics.

Examples of official/manufacturer facts:

- official checklist rows;
- official specifications;
- published odds;
- official guarantee/average language;
- official images;
- official SKUs/UPCs;
- official purchase URLs.

Examples of BoxScout intelligence:

- observed sealed pricing;
- completed sales;
- configuration normalization/inference;
- surfaced finite-card evidence;
- chase analysis;
- comparisons;
- future value modelling.

Manufacturer source attribution must not imply that the manufacturer endorses BoxScout or its independent analysis unless a formal relationship explicitly says so.

## Rule 12 — Commercial relationships cannot alter evidence

Affiliate, licensing, manufacturer or retailer relationships must never silently alter:

- evidence states;
- ranking logic;
- factual corrections;
- surfaced-card evidence;
- market-price observations;
- comparison conclusions.

Sponsored placement, if ever used, must be explicitly labelled and kept separate from factual rankings/recommendations.

## Image publication enforcement — Plan 004

Exact matching, usage rights and approval are separate. Official hosting, public access, an own scan or a user submission cannot alone satisfy publication rights. Unknown rights remains reference metadata or absent; no unlicensed binary is persisted. Generated public paths must be on the approved inventory, and builds reject orphan/stale files. Only public-safe review metadata may be committed; private permissions/contracts are not a GitHub asset.

This static/Git pilot cannot safely enforce expiring grants, so it rejects them for publication. Withdrawal requires explicit removal of the reviewed public file, regeneration, deployment and cache/old-deployment review; no automatic shared-history rewrite. Public availability must be checked directly, not inferred from a hidden UI URL. Confirm restore/retention policy separately before future object storage.

Future manufacturer-readiness should replace ad-hoc removal knowledge with an explicit asset inventory capable of answering where each approved asset is published and which derivatives depend on it. Any claim of withdrawal/removal should be scoped to BoxScout-controlled systems and verified after deployment.

Future confirmed 1/1 depletion requires the exact verified variant/finite instance and verified surfaced evidence. Deduplicate repeated listings/photos of the same card. No verified public evidence does not mean a card is definitely available. Eligible-chase/market-value/sealed-price intelligence must preserve scope, date and confidence, and must not convert asking prices into sales or uncertain evidence into fake EV.

## Plan 005 variant and eligibility rules

Do not duplicate canonical entries per configuration or generate serialTotal physical copies as gallery variants. Variant existence, exact numbering and configuration eligibility are independent facts. Publish only reviewed complete pilot families, preserving manufacturer row locators and secondary corroboration scope. Autograph Silver per-player totals rely on manufacturer rows; secondary evidence confirms the family totals rather than each assignment. Missing configuration mappings remain UNKNOWN, not exclusions. A probable retailer mapping cannot become verified through a verified family claim.

Legacy collection flags are deterministically Base/default flags, per Justin's explicit decision. No ambiguous reinterpretation, deletion or parallel fan-out. Future confirmed surfaced counts need exact finite-instance identity and deduplicated evidence, never inference from market absence. Preserve guarantee/average wording conflicts in existing configuration intelligence; this import does not resolve them.

## Persistent publication gate

Plan 006 requires full domain/provenance parity for the initial migration, exact no-op reruns, relational FK/enum/serial/default constraints and a separately approved publication digest. RAW/CANDIDATE entries or variants cannot publish. UNKNOWN/PROBABLE configuration facts remain allowed and qualified. A changed database digest without approval cannot replace the public snapshot. Offline prebuild verifies snapshot integrity and reproducibility. A differing populated catalogue is never overwritten by the bootstrap importer.

Backups are separate from Git. For the current reproducible catalogue, local external-to-repository dumps and tested recovery are approved; scheduled off-device backups must precede irreplaceable user/market/surfaced data. Restore into an isolated database and compare IDs, content hashes, provenance and permissions before cutover. See PERSISTENCE_RUNBOOK.md.

## Manufacturer-integration reference

See `MANUFACTURER_INTEGRATIONS.md` for the approved staged implementation direction covering source attribution, rights metadata, correction workflows, official purchase paths, structured manufacturer intake, future embargo handling and aggregate manufacturer analytics.
