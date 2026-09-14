# Execution Plan 003 — Complete Golden Product Base Checklist

## Status and authorization

PROPOSED — awaiting Justin's implementation approval. Planning researched on 2026-09-14. Plan 002 and the deployment are accepted as complete. This task creates only this proposal; it does not implement ingestion, expand fixtures, or change the application.

Baseline: main at 89702c8ff4eabc85c05e2a76529be35d66e87af2, synchronized with origin/main and clean before planning. Existing production site: https://boxscout.vercel.app, with GitHub main connected to automatic Vercel deployments. Follow the permanent GitHub push/verification completion gate in AGENTS.md and ASTRA_RUNBOOK.md.

## Objective and scope

Replace the 24-card Golden Product #1 sample with exactly 500 verified release-level base checklist identities for 2026 Panini Prizm FIFA World Cup. Establish a reproducible, reviewed canonical fixture while preserving the existing modular monolith, four-column mobile Cards page, search, image placeholders and browser-local Owned/Watching behavior.

This is release checklist completeness, not a claim that every card is verified pullable from the exact Mastermind Mega. Keep configuration assessment PROBABLE and card eligibility UNKNOWN unless a separate approved task establishes configuration-specific evidence.

No inserts, autographs, parallels, variants, image ingestion/acquisition, chase tracking, Supabase, authentication, Compare changes, additional products, monetization, new routes or paid infrastructure. Do not create a generic scraping platform. A source document may mention excluded content; do not normalize or publish those sections as catalogue records.

A local fixture of 500 short records is reasonable for Phase 1. No database is proposed. If actual measurement exposes a limitation that appears to require persistent infrastructure, stop and justify it rather than introducing Supabase.

## Research findings and source hierarchy

Source priority: Panini official checklist/documentation → official distributor/manufacturer checklist material → established checklist databases → secondary corroboration. Preserve publisher and host identity; a distributor-hosted file is not a Panini-hosted file. Source agreement is useful but may reflect a common upstream checklist rather than independently observed physical cards.

### 1. Panini official search — preferred authority, export not yet obtained

[Panini Search Checklist](https://www.paniniamerica.net/checklist.html)

The official page exposes Sport, Year, Brand and Program filters. The fetched document did not expose a matching file, and the live browser interaction did not yield usable selector options during this bounded review. No official-hosted Prizm World Cup checklist export has been verified in this planning task. This is an access/discovery gap, not evidence that Panini has no such checklist.

At implementation start, make a bounded attempt through the official selector for Soccer / 2026 / the exact Prizm FIFA World Cup program. Record any directly linked download URL, format, retrieval date, hash, version and relevant sheet/section. Prefer it if obtained. Do not substitute Panini Adrenalyn XL, sticker collections, Monopoly, or the separate 2025-26 Prizm FIFA release merely because their names overlap.

### 2. GTS Distribution — preferred available download lead

[GTS release checklist page](https://gogts.net/2026-panini-prizm-fifa-world-cup-soccer-cards-checklist/)

The June 12, 2026 distributor article links both a PDF and an Excel checklist for the exact release:

- [Excel checklist (.xls)](https://gogts.net/wp-content/uploads/2026/06/2026-Panini-Prizm-FIFA-World-Cup-Soccer-Cards-Checklist.xls)
- [PDF checklist](https://gogts.net/wp-content/uploads/2026/06/2026-Panini-Prizm-FIFA-World-Cup-Soccer-Cards-Checklist.pdf)

The web reader reported an unsupported Excel MIME type and a PDF larger than its limit (about 14.8 MB). A direct request to the article received an access challenge. The download links are established, but workbook sheets, columns, base-row count and full contents have not been inspected. Revalidate actual downloads during implementation; do not infer structure from the .xls extension. Prefer structured Excel over PDF extraction if accessible. PDF from the same publisher is a format cross-check, not independent evidence.

### 3. Trading Card Database — established checklist cross-check

[TCDB base checklist, set 614170](https://www.tcdb.com/Checklist.cfm/sid/614170/2026-Panini-Prizm-FIFA-World-Cup)

TCDB explicitly reports 500 total cards and separates the main checklist from inserts/related sets and errors/variations. The existing 24 identities already cite it. During implementation, use the base checklist's actual pagination/export links and confirm full coverage; the first page alone cannot verify 500 records. Do not acquire images or import parallel set pages.

### 4. Checklist Insider — secondary corroboration and structured fallback

[Checklist Insider exact release page](https://www.checklistinsider.com/2026-panini-prizm-fifa-world-cup-soccer)

The page has a bounded Base Checklist section marked 500 cards, followed by other sections and repeated team checklists. The visible base list reaches #500 Daniel Svensson — Sweden. It also links an [Excel spreadsheet](https://xcdn.checklistinsider.com/public/2026/06/2026-Panini-Prizm-FIFA-World-Cup-Soccer-Checklist-Downloads-Excel-spreadsheet-Checklist-Insider.xlsx). The spreadsheet was identified but not parsed; the web reader does not support its MIME type. The page qualifies the checklist as subject to change.

Use it to corroborate every base record, not to scrape all number-looking rows from the entire article. The repeated team lists and excluded subsets create a clear duplication/contamination risk. It is already a source for the existing sample.

### 5. Beckett — additional lead, currently unavailable

[Beckett release checklist page](https://www.beckett.com/news/2026-panini-prizm-fifa-world-cup-soccer-cards/)

Search results identify a 500-card checklist and XLSX download, but opening the page redirected to a maintenance page. Do not use search snippets as row evidence. Recheck only if an additional source is needed and accessible; it is not a required dependency.

### Evidence boundary

This proposal has not ingested or reconciled all 500 records and does not claim that they agree. Prefer official/GTS material plus a separately published checklist and, where reasonably available, TCDB plus Checklist Insider. If official/GTS access remains unavailable, a fully reconciled TCDB + Checklist Insider dataset can support scoped VERIFIED release identities after review, with the official-source gap disclosed. Do not silently reduce to a single third-party source.

If usable full independent verification cannot be obtained, preserve the current fixture and report the coverage gap. Do not fill missing rows from memory, infer names from squad lists, bypass access controls, or claim completion because a source headline says 500.

## Proposed reproducible ingestion workflow

```text
Pinned source observations
  → source-specific raw base import records
  → deterministic normalization and source reconciliation
  → explicit discrepancy review
  → validated canonical typed fixture
  → existing catalogue repository → existing Cards UI
```

1. **Capture sources once, deliberately.** Record publisher, authority tier, landing/download URLs, actual observedAt/checkedAt, media type, SHA-256 and extraction locator (sheet/row or page/section). Preserve permitted original source files outside public assets, or a minimal lossless base-section snapshot plus its capture method and original hash. Raw records retain source spelling, country labels, card type, number text and source row locator. Do not copy unrelated article text or images into the application. If redistribution of a full source file is inappropriate, keep the factual raw base extract and manifest sufficient to replay normalization offline.
2. **Inspect the actual structure.** Determine whether the XLS is binary Excel, HTML/XML or another format, and identify the correct worksheet/section. Reject HTML challenges, truncated pages and wrong-release downloads. Prefer one small existing parser or a reviewed development-only converter if necessary; do not add a runtime spreadsheet dependency. Document parser/tool version and the one-time extraction command. Any required dependency change must be narrow and justified by the actual format.
3. **Use a lightweight raw/import contract.** Store sourceId, locator, raw card number, raw player name, raw country/team and raw subset/type. A source-specific adapter emits this contract; the shared normalizer operates on it. No live network requests during application builds or page requests. Retrieval, normalization and promotion are separate commands/steps.
4. **Normalize conservatively.** Decode HTML entities where applicable, normalize Unicode to NFC, trim/collapse formatting whitespace, and parse whole numeric base-card numbers. Preserve source text alongside normalized text. Do not infer diacritics, transliterate names, deduplicate by player name, replace team identity with nationality, or correct a person from general football knowledge. Strip RC or other annotations only from a structurally identified annotation field, not a broad text substitution.
5. **Select base records by section/type and release, then number.** An allowlist of inspected source base sections is required. Numeric numbers 1–500 alone do not distinguish base cards from inserts. Do not flatten all workbook sheets, repeated team checklists, variation rows or parallel lists. Reject unexpected schemas and mixed categories; never silently truncate/deduplicate to reach 500.
6. **Reconcile all records by release + Base + card number.** Compare name, country/team and base membership across sources. Formatting-only normalization must be documented. Any substantive spelling/name/team/number disagreement goes to a checked-in discrepancy ledger with all source values, locators, state, reviewer decision, rationale, evidence and review date. An explicit country-label alias may be approved for equivalent labels; never silently conflate different teams.
7. **Gate canonical promotion.** RAW/CANDIDATE records remain outside the runtime fixture. Unresolved substantive discrepancies or missing evidence block replacement of the published sample with a purported complete verified set. Resolved differences remain in the ledger. Higher authority informs a reviewed resolution but does not erase disagreement or permit an automatic winner. A name appearing twice is not a duplicate identity if distinct sourced card numbers legitimately support it.
8. **Generate deterministically.** Produce the same ordered readonly TypeScript fixture from pinned raw extracts, manifest and reviewed resolutions. Stable output excludes generation-time timestamps; retain actual observation dates. Provide a check mode that regenerates into memory/a temporary file and fails on drift. Do not overwrite the working canonical fixture if validation fails. Re-running from pinned inputs must produce byte-identical output.

Only the reviewed canonical output is imported at runtime. Source snapshots and the discrepancy ledger are review artifacts, not a client bundle or public download feature. This creates a small reusable normalization contract without building multi-product infrastructure.

## Data model and identity preservation

Retain the existing Card fields: id, releaseId, cardNumber (string), playerName, country, subset, sortOrder, provenance and image metadata. Add explicit record-level verificationState to Card, scoped to base checklist identity; keep source observation verification distinct. Add an optional sourceId/locator reference to Provenance or a narrowly scoped checklist evidence reference so existing configuration/price records remain compatible. Do not refactor unrelated evidence types.

Use the exact existing release ID `panini-prizm-fifa-world-cup-2026` and ID rule `panini-prizm-fifa-world-cup-2026-base-{number}`. Base card numbers are strings without incidental whitespace/leading formatting zeroes, while sortOrder is the numeric value 1–500. `subset: Base` supplies the card-type distinction; excluded types never enter this fixture.

Preserve all 24 existing IDs byte-for-byte. Add an explicit frozen legacy-ID compatibility test rather than relying only on the generator's own formula. If evidence corrects a display name on the same canonical numbered card, preserve the ID and log the correction. If a true identity collision is found, stop and propose a migration before changing IDs.

Keep `boxscout:collection:v1`, version 1 serialization, collection repository and independent owned/watched booleans unchanged. Existing saved entries must survive expansion and toggling new cards; never clear storage or prune keys based on the visible search result. No account or storage migration is expected. Browser-local state is origin-specific: localhost, previews and the production hostname do not share it automatically.

All 500 records retain intentional MISSING / UNKNOWN_RIGHTS image metadata. Record verification concerns checklist identity only, not images, odds, Mastermind eligibility or guaranteed contents.

## Expected implementation files

Paths are relative to the Boxscout repository; names can be refined when source formats are inspected without broadening scope.

| File/area | Proposed change |
| --- | --- |
| data/imports/golden-product-base/manifest.json | Source IDs, URLs, actual observation dates, hashes, format and capture/extraction details. |
| data/imports/golden-product-base/raw/ | Pinned source-specific base extracts and permitted source files; no imagery or runtime imports. |
| data/imports/golden-product-base/discrepancies.json | Explicit conflicts and reviewed resolutions; empty only after comparison actually establishes no conflicts. |
| scripts/checklists/import-golden-base.ts | Small source adapters, reproducible orchestration and check/write modes. |
| src/domain/catalog/checklist-validation.ts | Pure base-record validation and conservative normalization, no network or UI. |
| src/types/catalog.ts | Explicit Card verification and narrow source-reference metadata. |
| src/data/fixtures/golden-base-checklist.ts | Generated canonical readonly base data and scoped provenance. |
| src/data/fixtures/golden-product.ts | Replace 24-row source with generated data; preserve product/release/config IDs, exports and UNKNOWN eligibility. |
| src/repositories/catalog-repository.ts | Only if needed to expose full checklist coverage/source metadata; no fixture access from UI. |
| src/app/products/[productSlug]/cards/page.tsx | Replace sample/partial/#1–24 coverage text with validated base coverage and source dates. |
| src/components/cards/card-browser.tsx | Copy-only removal of BASE · SAMPLE and sample-specific empty-state wording; retain behavior/layout. |
| src/app/products/[productSlug]/page.tsx | Remove sample wording in checklist callout; unchanged configuration intelligence. |
| tests/checklist-import.test.ts | Import validation, reconciliation, reproducibility and failure-path tests. |
| tests/boxscout.test.ts | Full-set assertions, explicit legacy-ID/persistence tests and search cases. |
| package.json | Optional lightweight import/check scripts; parser/tool dependency only if actually required and justified. |
| package-lock.json | Only if a justified development parser dependency is necessary; otherwise unchanged. |
| README.md, docs/DATA_MODEL.md, docs/GOLDEN_PRODUCT.md | Import replay commands, source scope, full base coverage, remaining limitations and evidence review. |
| AGENTS.md and this plan | Point to approved Plan 003 after approval; record actual checks/results and completion. |

No new CSS, page layout, routes, image files or collection-storage changes are planned. Raw provenance references can resolve to shared source objects to avoid duplicating long evidence payloads in every card; do not redesign the repository API for hypothetical scale.

## Deterministic validation and test plan

Canonical promotion must fail unless:

- There are exactly 500 base records and the card-number set equals every integer 1 through 500, with no gaps, extras or duplicate numbers.
- Stable IDs are unique, match the approved release/base identity scheme, and preserve the exact 24 legacy IDs.
- Numeric ordering is 1…500; sortOrder matches card number, not lexical ordering (1, 10, 100).
- Release ID, nonempty player name, nonempty source-supported country/team, Base subset/type and VERIFIED record state are present. No placeholders such as TBD are accepted as verified players.
- Every row resolves to source evidence with source URL, publisher, source locator, actual checked/observed date, verification scope and review status. Cross-source coverage is checked per row, not merely by attaching two global source names.
- No unresolved material discrepancy remains. No wrong release, insert/auto/parallel/variation row or repeated team-list copy is mixed into base data.
- Invalid/truncated raw input, unexpected sections, malformed numbers, duplicate identities, unresolved aliases and missing evidence fail without modifying canonical output.
- Repeated offline generation from pinned input is identical; check mode detects edited output and altered source hashes.

Tests should include small deliberately invalid inputs for each failure class, plus verification of the actual full fixture and provenance coverage. Do not create tests that merely copy the generator's assumptions.

Retain the existing configuration/price, unknown-product, image-rights, malformed-storage and storage-failure tests. Update only sample-specific expectations: count 24, exact two-source assumptions and hard-coded checked dates are replaced with meaningful full-coverage/evidence checks. Search remains current case-insensitive name and substring card-number matching; a query such as #24 may now legitimately match #240–249 as well. Test #500, a sourced later player, whitespace/case, no-match and reset without introducing new search semantics.

Seed an actual version-1 storage payload using existing card IDs before catalogue expansion, then load against 500 cards. Assert old owned/watched combinations remain, new cards default false, both flags can be true, toggling one leaves the other intact, and saving a new card preserves earlier entries. Browser tests should seed through the existing controls before switching to the expanded build, refresh, and verify on the same origin.

Run npm run lint, npm run typecheck, npm test and npm run build, plus the import reproducibility/check command. Fix failures; do not disable assertions to reach 500.

## Mobile performance assessment

500 short records are not evidence that a database or virtualization is needed. The current component filters linearly and renders all matching tiles, with two controls each; likely pressure points are server HTML/client serialization, hydration, DOM size and rerendering during typing/toggles. Placeholders avoid image-network cost but do not remove DOM work.

Measure the 24-card baseline before replacing it and compare the 500-card production build under the same viewport/browser/network conditions. Inspect 390×844 and 375×812 plus a minimal desktop check. Record page payload/DOM size where tooling permits, time to usable search and controls, repeated search-to-paint/toggle-to-paint responsiveness and scrolling near the first, middle and last rows. Use a documented modest CPU/network throttle if available; do not present desktop viewport emulation as real iPhone hardware testing.

Proposed investigation thresholds, not claimed measurements: repeated local input/toggle latency above 200 ms or interaction-blocking pauses around 500 ms warrant profiling. A usable page should expose controls within about 3 seconds in the documented simulated conditions; distinguish network/backend delays from rendering cost. Record actual measurements and visible stutter rather than asserting performance from record count alone.

Start with the existing grid and search. If a meaningful regression is measured, identify the cause and make only the smallest justified optimization within scope. Virtualization, pagination or heavy libraries require actual evidence and a revised bounded proposal before implementation; do not add them preemptively or hide poor performance by testing only filtered one-card results.

## Acceptance criteria and completion

1. All 500 base identities are reviewed, source-supported and reproducibly generated, with no unresolved substantive conflicts. Full base coverage is not full release/variant coverage.
2. All 24 existing IDs and local flags survive without storage reset or migration. All existing behavior tests pass.
3. Cards displays 500 records in numeric order using the current design; obsolete sample wording is removed. Search, independent flags and refresh persistence work for early and late cards. Placeholders remain intentional.
4. Configuration confidence, prices, eligibility semantics and excluded feature areas remain unchanged. No database or image acquisition is introduced.
5. Performance is measured and recorded at mobile sizes with no horizontal overflow, console-breaking errors or unexplained blocking regressions. Limitations of device emulation are stated.
6. Raw imports, provenance, discrepancies and canonical output are clearly separated; replay is offline and deterministic from pinned inputs, and invalid input never overwrites working canonical data.
7. Required commands pass; full diff is reviewed; coherent commits are pushed normally to GitHub. Fetch and compare local main, origin/main and live remote main; working tree is clean. Stop on unexpected remote divergence, never force-push.
8. Because main deploys automatically, verify Vercel production Ready at the implementation commit and smoke-test Products → Overview → Cards/search/flags on the deployed origin. Report commit, data sources, reconciliation results, tests, performance observations and remaining gaps. Stop after Plan 003.

## Unresolved issues and approval boundary

- A Panini-hosted exact release export has not been located; official selector access needs another bounded attempt.
- GTS download format, worksheet layout and 500-row contents are not yet inspected; direct article access encountered a challenge. No bypass is proposed.
- Full row-by-row source agreement is untested. Potential spelling, diacritic, team-label and late checklist corrections must be preserved and reviewed, not assumed absent.
- TCDB pagination and Checklist Insider's repeated team/parallel sections require strict source adapters. Corroborating sites may share upstream errors.
- Existing #1–24 records need revalidation against the complete sources, while their stable identity keys remain protected.
- Performance on 500 real records is unmeasured until implementation. Current architecture provides no reason to require Supabase.

No new product decision is needed for this conservative proposal. Approval authorizes the bounded workflow, not invented records or silent source-conflict resolution. If required source access fails or evidence cannot substantiate all 500, keep the current canonical sample and explain the blocker.

This planning task changes only this document. Implementation, application/data/test changes and the AGENTS active-plan pointer wait for Justin's approval.
