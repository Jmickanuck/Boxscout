# Execution Plan 007 — Set to box navigation

## Scope
User requested on 2026-09-15: preserve the homepage appearance, but open a set-level box selection before the existing Mega Box product. Work incrementally and preserve the backend, published catalogue, card filters and browser-local collection state.

## Implementation
- Add release discovery to the existing catalogue repository, derived from published products and keyed by existing release ID. No canonical schema or publication changes.
- Point homepage release cards to /sets/[releaseId]. Keep the current visual style; replace Mega-specific homepage copy with set-level navigation copy.
- Add a mobile-first set page listing supported products for that release. Known configuration placeholders depend on the user's pending preference; do not invent products or eligibility.
- Link the existing product header back to the set's boxes. Preserve existing product and Cards URLs.
- Update UI_SPEC with the final navigation and coverage behavior.

## Verification
Run lint, typecheck, existing tests and production build; verify homepage to set to Mega to Cards, back navigation, unknown-set 404, mobile layout and both themes. Review diff; commit, push, and verify remote synchronization. Do not modify database or collection identities.

## Status
User confirmed known box formats with only Mega opening. Implemented eight published format cards, preserving confidence labels and existing product routes. Lint, typecheck, 47 tests and production build passed. Local navigation Home → set → Mega → Cards → set passed. Set page checked in Dark at 390×844 and Light at 375×812; no visible horizontal overflow. Unknown set returns HTTP 404. Browser warning/error capture empty. Canonical publication digest unchanged. Diff reviewed; Git/deployment verification follows.


## User direction for subsequent data work

Collect the full card-set information, identify all its products/box formats, then map exact cards/variants to each product using source evidence. Store shared cards once, with separate configuration eligibility relationships and unknown/conflicting states retained. The current database supports this structure, but the loaded pilot is incomplete. This navigation task does not implement automatic ingestion or complete those mappings.
