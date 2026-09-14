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


## Image publication enforcement — Plan 004

Exact matching, usage rights and approval are separate. Official hosting, public access, an own scan or a user submission cannot alone satisfy publication rights. Unknown rights remains reference metadata or absent; no unlicensed binary is persisted. Generated public paths must be on the approved inventory, and builds reject orphan/stale files. Only public-safe review metadata may be committed; private permissions/contracts are not a GitHub asset.

This static/Git pilot cannot safely enforce expiring grants, so it rejects them for publication. Withdrawal requires explicit removal of the reviewed public file, regeneration, deployment and cache/old-deployment review; no automatic shared-history rewrite. Public availability must be checked directly, not inferred from a hidden UI URL. Confirm restore/retention policy separately before future object storage.

Future confirmed 1/1 depletion requires the exact verified variant/finite instance and verified surfaced evidence. Deduplicate repeated listings/photos of the same card. No verified public evidence does not mean a card is definitely available. Eligible-chase/market-value/sealed-price intelligence must preserve scope, date and confidence, and must not convert asking prices into sales or uncertain evidence into fake EV.
