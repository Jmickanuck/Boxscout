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
