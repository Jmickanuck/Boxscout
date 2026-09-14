# Execution Plan 005 — Release, Variant and Configuration Foundation

## Status and approval boundary

PROPOSED — planning/research only, checked 2026-09-14. Implementation requires Justin's explicit approval. Baseline main: ad679558eac6d46a3e0569efc912f91164af7da9, clean and synchronized after fetch. This planning task changes only this document. AGENTS.md continues to point at Plan 004 until an approved implementation updates it.

Read the project instructions and relevant PRODUCT, ARCHITECTURE, DATA_MODEL, DATA_INTEGRITY, UI_SPEC, GOLDEN_PRODUCT, ASTRA_RUNBOOK, monetization/ADR guidance and Plan 004. Inspect existing checklist, collection, search, repository and image boundaries. Preserve the modular monolith, current routes, dark/light theme, 500 canonical base IDs, existing browser state and approved four-column tile.

Goal: reusable Release → ChecklistEntry → Variant identity and Configuration ↔ VariantEligibility, with trustworthy variant-aware browsing. A release-wide checklist is not a list of everything available in each box. This is a foundation proposal, not approval to ingest the entire release automatically.

## Research and evidence register

Source priority remains Panini official, manufacturer-authored/distributor material, established checklist databases, then secondary corroboration. Source authority, factual verification, configuration linkage and image rights are separate assessments. All links below were researched on the checked date; no new images or source-page copies enter the repository.

| Source | Findings and limits |
| --- | --- |
| [Panini release article](https://blog.paniniamerica.net/panini-prizm-fifa-world-cup-2026-hits-the-net/) | Official evidence for Hobby, FOTL and Blaster distinctions. Hobby examples include Aguila /70, Maple Leaf /86 and Old Glory /94; FOTL includes Shimmer offerings. Retail Wave examples are described separately. Box counts are averages. This is promotional coverage, not an exhaustive exact-card eligibility matrix. |
| [GTS release/checklist page](https://gogts.net/2026-panini-prizm-fifa-world-cup-soccer-cards-checklist/) and [downloadable workbook](https://gogts.net/wp-content/uploads/2026/06/2026-Panini-Prizm-FIFA-World-Cup-Soccer-Cards-Checklist.xls) | Manufacturer checklist distributed by GTS is the preferred structured input found. Reused the original temporary Plan 003 workbook; SHA-256 640b016bb22918df24f87a99c78573dfcd778ef05cab5605c63677b371d7b52f. It lists set, number, athlete, team, position and sequence. It does not supply an exhaustive configuration-to-card join. No matching Panini-hosted comprehensive workbook was established. |
| [Panini NPP sell sheet hosted by GTS](https://gogts.net/wp-content/uploads/2026/06/2026-Panini-Prizm-World-Cup-Soccer-Cards-Sell-Sheet-Retail.pdf) | Manufacturer-authored source distinguishes NPP Mega, NPP Blaster and NPP Counter Display. Explicitly labels Red Disco as NPP Mega and Orange Flash as NPP Counter Display. Mega is six packs of seven cards. Guarantee wording must remain source-specific; packaging/retailer average wording is not erased. This does not establish the Mastermind UPC-to-NPP bridge. |
| [GTS Choice](https://gogts.net/2026-panini-prizm-choice-fifa-world-cup-soccer-cards/) | One eight-card pack; describes one autograph and Choice Red /85, Blue /38, Plum Blossom /8. Retain its own box-claim semantics. A Choice name is strong evidence to investigate, not permission to assign every similarly named card without checking scope. |
| [Steel City Hobby Mega listing](https://www.steelcitycollectibles.com/i/2026-panini-prizm-fifa-world-cup-soccer-hobby-mega-box) | Distinct Hobby Mega listing, UPC 746134202612, six seven-card packs. Explicitly warns that release checklist contents may be exclusive to other versions. Its description includes Choice language: do not convert that boilerplate into Hobby Mega eligibility. No new price observation or product listing is proposed. |
| [Checklist Insider](https://www.checklistinsider.com/2026-panini-prizm-fifa-world-cup-soccer) | Independent corroboration for base, variations, insert and autograph subsets. Shows 25 Base Variations and card-specific autograph parallel exceptions. Useful comparison source, not an official configuration authority. |
| [Collectosk](https://www.collectosk.com/2026-panini-prizm-fifa-world-cup-2026-soccer-cards/) | Discovery leads for DSG, Excell, Preferred, International and retailer-specific Blasters. Labels Bronze Disco /175 and Green & White Disco /70 DSG, Blue Disco /49 Hobby Mega, Red Disco /99 NPP. Treat these secondary mappings as provisional until corroborated. DSG is described as six seven-card packs with six Disco parallels on average. |
| [Beckett checklist](https://www.beckett.com/news/2026-panini-prizm-fifa-world-cup-soccer-cards/) | Search-index material was available, but direct access redirected to maintenance. Do not treat cached snippets as completed independent verification; recheck when available. |

### Entry and variant families; estimated scale

Direct inspection of the existing GTS workbook found 55,677 populated data rows in 535 set/parallel labels. Of these, 1,387 rows occur in 32 unsuffixed subset labels; Base accounts for 500, Base Variations 25, Aces 25 and 1994 Team USA Signatures nine. Base plus its parallel labels alone account for 43,500 rows (87 versions including standard).

These are source-row counts, not a VERIFIED canonical total. Parallel-only subjects, repeated multi-subject identities, missing standard versions and source disagreements require reconciliation. Planning envelope: roughly 1,400–1,600 checklist entries and 50,000–60,000 exact variants across the release, not 55,000 finite physical copies. Final counts must come from reviewed identity normalization.

Represent Base; Insert (including multi-player, team/badge and poster subjects); Autograph (including dual/trio/quad signers); Variation; and a supported future Memorabilia category. No positive relic/memorabilia subset was established in this review; do not fabricate one or assert that none can exist. Preserve unknown/unclassified input for review.

Observed parallel families include Silver, Disco, Wave, Flash, Shimmer, Choice, Preferred, Breakaway and Celestial Lattice, plus numbered colors and special patterns. Family names are not universal print runs. Workbook examples show 1994 Team USA Silver #1 at /199 and other entries at /75. A variant may be absent for a signer even when the subset has that parallel. Never generate a full entry × parallel Cartesian product.

### Configuration registry proposal

| Family | Evidence and initial handling |
| --- | --- |
| Hobby | Official Panini support; distinct configuration. Inherit no retail/Choice eligibility. |
| FOTL | Separate supported configuration, not an attribute silently attached to ordinary Hobby. Official Shimmer examples need exact subset/card scope. |
| Choice | Distributor/manufacturer support; separate eight-card format and documented families. |
| NPP Mega | Manufacturer sell-sheet support for the family. Exact Mastermind retail mapping remains PROBABLE until authoritative UPC linkage is obtained. |
| Hobby Mega | Exact retailer listing establishes a distinct listing/identifier; manufacturer-level family/parallel mapping still needs stronger evidence. Not equivalent to NPP merely because pack counts match. |
| DSG Mega | Secondary discovery evidence; provisional configuration and mappings, not VERIFIED product intelligence. |
| NPP Blaster / NPP Counter Display | Manufacturer sheet distinguishes these from NPP Mega; retain separate identities and source-scoped claims. |
| Excell Mega, Hobby Preferred, Hobby International, Hobby/Excell/MJH Blasters | Research leads only. Do not create verified customer-facing coverage or infer equivalence from abbreviated names. Breakaway/White Sparkle parallel names alone do not establish a sealed SKU. |

Registry entries do not create additional Products pages, retailer offers or prices. Keep the current product-to-configuration assessment independent of the release configuration registry. Promotional sheets may be revised; record version/date and qualifiers.

## Proposed domain model

| Concept | Minimum responsibility |
| --- | --- |
| Release | Existing stable release ID, title and dated provenance. One release owns many entries and configurations. |
| ChecklistEntry | Existing Card becomes a compatible entry abstraction: id, releaseId, subsetId, printed cardNumber as text, entryType, displayName, supported subjects/teams, sortOrder, optional variationOfEntryId, verification and provenance. Preserve existing base IDs byte-for-byte. Number alone is not globally unique. |
| Subset | Stable release-scoped identity, source name, normalized type and aliases. Autograph subsets are first-class entries, not automatically versions of base cards. A variation can link to a base entry while keeping separate identity. |
| Variant | Stable id, entryId, familyId/name, standard-versus-parallel kind, numbering state, nullable serialTotal, supported auto/relic traits, verification and provenance. Each standard edition is an exact variant only where its existence is evidenced; no synthetic standard edition for parallel-only entries. |
| VariantFamily | Small shared naming/alias vocabulary scoped by release/subset where necessary. May aid grouping; does not imply every entry has that family or shares its print run. |
| Configuration | Stable release-scoped ID, manufacturer/channel designation and provenance. Existing retailer SKU/UPC remains listing identity and links through an independently assessed mapping. |
| EligibilityClaim / assessment | Exact configuration and variant references, source claim, scope, checked date, inclusion/exclusion assertion, review state and rationale. Preserve conflicting claims; derive a separately explained effective assessment. |

Stable IDs must not depend on a player's spelling, array position, retailer, configuration or a correctable print-run value. New entries use reviewed subset + printed-number identity with a discriminator where necessary. Multi-player cards contain several subjects but remain one entry. Require a display name, not a player name for a team badge. Maintain the legacy Card projection through the repository rather than destructively rewriting all consumers.

Numbering is a discriminated state: NUMBERED with positive integer serialTotal; UNNUMBERED with no total; UNKNOWN with no guessed total. A blank sequence cell is not automatically proof of unnumbered status. SSP/case-hit wording is not a serial total. /1 describes a variant's edition, not a discovered physical card. Serial ordinal belongs to future FiniteInstance, not Variant.

Image assets retain existing cardId as the entry reference and use variantId for an exact version, front/back independently. No base image may silently stand in for a parallel. Existing null-variant base assets need an explicit standard-image compatibility rule; keep the Plan 004 independent match/rights/approval gates. Unknown exact image remains a placeholder. No acquisition in this plan.

### Eligibility semantics

Use INCLUDED, EXCLUDED, UNKNOWN and CONFLICTING as effective eligibility states, independent of VERIFIED/PROBABLE/UNKNOWN evidence confidence and source review. Avoid invented numeric confidence scores. Missing edge means unknown, never excluded. Exclusion requires explicit evidence; a family name or missing checklist row is insufficient.

Retain source-specific assertions and a reviewed resolution record. Family-wide rules may compile to exact edges only with explicit target subset, covered entries, exceptions and evidence. A broad 'retail' statement does not justify each Mega family. Exclusivity may generate exclusions only across a demonstrably defined scope. Reproducible generated joins must expose the claims from which they derive.

For the selected Mastermind box, confidence is bounded by both its PROBABLE configuration mapping and the variant eligibility evidence. A verified NPP claim cannot make the exact retailer box VERIFIED. Strict confirmed-only filtering may consequently return no confirmed results; explain this rather than claiming the box contains no cards. Offer separately labelled probable results without including UNKNOWN or CONFLICTING entries as pullable.

### Ownership and future intelligence boundary

Future CollectionEntry references Variant, optionally FiniteInstance; quantity, serial ordinal, condition, raw/graded state, grading company/grade, purchase price and valuation history belong in personal/observation models. Do not implement these fields, accounts or valuations now.

Preserve boxscout:collection:v1 without deletion or automatic fan-out. Existing entry-level marks mean 'variant unspecified', because prior UI never asked which parallel was owned. Keep them usable in default entry browsing and legacy Owned/Watching filters. Proposed exact-variant flags use a separate versioned preference repository; do not infer flags for every parallel or silently clear old marks. Show a concise filter-level explanation of unspecified legacy marks. Future explicit resolution can associate one with a chosen variant; that migration UI is deferred. New exact-variant flags remain independent Owned and Watching toggles. Account-backed persistence can later replace the storage adapter.

Preserve Variant → FiniteInstance → SurfaceObservation → Evidence. Repeated listings/images of one physical card must not count as several surfaced instances. A confirmed exclusive NPP 1/1 would affect only supported NPP eligibility; a shared variant must not be attributed to a particular box without evidence. 'Not publicly observed' never proves still sealed. Current price, eligible chase structure, supported market values and reviewed finite evidence are future analytics inputs, not a Plan 005 score or EV.

## Recommended bounded implementation slice

Approval should explicitly cover this pilot rather than silently authorizing 55,000 variants:

1. Keep all 500 base entries. Add complete Base Variations (25), Aces (25) and 1994 Team USA Signatures (nine) where corroborated: target 559 entries. This exercises alternate identity, inserts and first-class autographs. Other subset families remain research coverage, not a claimed complete release catalogue.
2. Model evidenced standard variants for that scope; add complete Base Red Disco /99, Pink Disco /25 and Black /1 families, plus the nine autograph Silver versions with their per-entry totals. Provisional upper target: 2,068 variants (559 standard + 1,500 base parallels + nine autograph parallels), conditional on row-by-row existence/numbering verification. Never invent records to meet the count.
3. Add the supported/provisional configuration registry above and only evidenced eligibility claims relevant to this pilot. Unknown mappings are an acceptable result; no quota for verified edges. Missing manufacturer evidence does not erase useful probable claims.
4. Implement reusable validation, generated repository projections and Cards filters. Show coverage as a reviewed pilot, so 'all autographs' means all loaded autograph entries, not every autograph in the release.
5. Stop after verification and publication. Full release expansion, relic acquisition and more subsets require another bounded approval. Synthetic tests can exercise multi-subject/parallel-only/relic cases without publishing invented catalogue records.

If Justin prefers full release ingestion immediately, re-estimate that separate scope before implementation. The pilot size and legacy-state treatment are the two material product choices in this proposal.

## Reusable ingestion workflow

Source manifest → product-specific extraction → normalized factual candidate rows → identity/variant/eligibility validation → independent corroboration and discrepancy review → deterministic canonical fixtures → repository projections → UI.

Reuse scripts/checklists rather than introduce a crawler/platform. Extend shared normalization for string numbers, subjects, subset identity and serial states. Keep Prizm workbook naming rules in its adapter: names such as 'Base Choice Prizms' and 'Aces Prizms Silver' require explicit mappings, not a universal string split. Product #2 should prove broader abstractions before generalizing them.

Retain URL, publisher, source tier, retrieved/checked dates, sheet/row or section locator, useful hash, source-specific value and reviewer rationale. Store normalized factual extracts and discrepancy records, not complete copied third-party pages. Reuse the legitimately obtained temporary workbook; document retention justification before committing any original material. Offline replay uses reviewed normalized input, never a live page that changes during build.

Reconcile by subset + card number + subject identity and edition. Preserve spelling aliases and previously reviewed Plan 003 resolutions. Differences in subject, subset, serial total, membership or configuration block VERIFIED promotion for the affected fact. A resolved discrepancy needs an explicit decision and evidence; do not discard either source. Stable sorting and byte-identical regeneration are required.

## Cards-page UX proposal

Preserve four columns at 375px and 390px, current tile spacing, image dominance, Owned top-left, Watching top-right and number/name caption. Keep default Base entry browsing at 500 cards and current routes. Put compact filters above the gallery, with an expandable advanced panel rather than metadata panels inside tiles.

- Entry type: Base, Inserts, Autographs, Variations; show other types only when supported data exists. Type and auto/relic traits are separately defined so overlapping characteristics are not lost.
- Edition: standard/parallel; numbered-only; maximum serial total presets 99, 25, 1. Bounds are inclusive and exclude unknown/unnumbered totals. /1 is not proof of surfaced status.
- Search: existing name and # matching plus subset/parallel aliases. 'Messi' searches subjects; 'Red Disco' selects matching exact variants. Combine facet groups with AND, values within one group with OR; show active chips and clear-all.
- Scope: release catalogue or current-box eligibility, with confirmed versus include-probable control and visible coverage/uncertainty. Do not change the current product identity when exploring another configuration's reference filter.
- Owned/Watching: independent filters, including their intersection, with explicit legacy unspecified-state handling. Entry mode can aggregate exact variant flags for browsing but cannot claim ownership of another edition.

When variant criteria are active, switch visibly to exact-variant results. Group results by subset + parallel + numbering context, using headings above otherwise unchanged tile grids; this distinguishes identical number/name tiles without changing the canonical caption. Include full variant identity in accessible labels and placeholder alt text. Autograph families with different totals require distinct group context. A clear 'Entries / Exact variants' indicator and counts prevent double-counting expectations. No card-detail route or major redesign.

## Likely implementation files (not changed now)

- src/types/catalog.ts and a small variants/eligibility type module if separation helps; src/types/images.ts only for compatible entry/variant joins.
- scripts/checklists shared normalization/validation/generation plus a Prizm adapter; data/imports/golden-product-variants/ manifests, factual inputs, discrepancies and README.
- src/data/fixtures/generated/ release entries, variants and eligibility sidecars; preserve existing base fixture IDs and documented provenance.
- src/repositories/catalog-repository.ts and focused variant/configuration repository projections; src/domain/catalog/search.ts and filter/eligibility functions.
- src/components/cards/card-browser.tsx, a compact filter component and minimal styling; card-image.tsx only for exact variant selection. Existing route file may pass a new projection without changing its URL.
- Existing collection preference abstraction plus a separate variant-state adapter; do not scatter browser storage calls through UI.
- Focused tests for normalization, eligibility, filters, images and collection compatibility; package.json only for reusable replay/check commands if needed. No new dependency presumed.
- During approved implementation: DATA_MODEL, DATA_INTEGRITY, ARCHITECTURE, UI_SPEC, GOLDEN_PRODUCT, PRODUCT as materially needed; active-plan pointer/runbook and an ADR for entry/variant identity. This planning commit changes none of them.

## Validation, tests and performance

Deterministic data checks: exactly 500 original base entries numbered 1–500 once; all legacy IDs unchanged; subset-local number uniqueness with explicit variation exceptions; unique variant IDs; valid same-release joins; per-record provenance; no unsupported Cartesian expansion; typed serial invariants; per-card autograph exceptions; no duplicate multi-subject card; no invented relic/standard editions; bounded pilot count report with blocked rows explained.

Eligibility tests: included/excluded/unknown/conflicting; probable retailer mapping cannot produce confirmed exact-box results; absent edges remain unknown; broad retail claims cannot spill across configurations; exclusions and exclusive-family scope validated; contradictions preserved. Synthetic second-release inputs test shared code without adding a new product.

Search/filter tests: Messi and #500 unchanged; Red Disco; Base/Insert/Autograph/Variation; all numbered and inclusive /99, /25, /1; unknown totals excluded; combined filters and empty-state explanation; deterministic grouping/counts. Test legacy v1 byte preservation, no fan-out, independent exact flags, refresh and storage failure handling. Images must match the exact variant, retain unknown-rights rejection and missing-image fallback.

The pilot is practical with current typed fixtures/repositories and needs no Supabase. At an assumed 0.5–1 KB per expanded variant, 55K rows could occupy roughly 28–56 MB before compression and duplicate provenance; this is a planning estimate, not measured output. Keep source text/provenance tables normalized and server-side, and send only the fields required for browsing. Do not ship the future full release graph inside every tile or initial client payload.

Measure pilot versus current production baseline using identical conditions: initial HTML/React payload, script transfer, JSON projection size, cold/warm navigation, search/toggle latency and scrolling/memory observations. Target interactions under 100ms on the tested device and no material default-500 regression; document measured limits rather than claim field metrics. Never render 55K tiles at once. If full-release expansion later requires bounded result delivery, first measure and propose pagination/windowing; no premature heavy library or database now.

Run lint, typecheck, tests, production build, checklist replay/check and image check after implementation. Verify local and deployed default gallery plus exact variants at 375×812, 390×844 and desktop, both themes, no overflow, readable grouping/focus, search, independent flags and refresh, no console-breaking errors. Keep placeholders and lazy/responsive image behavior intact. Record actual payload/performance observations.

## Evidence gaps, conflicts and acceptance

Unresolved: authoritative Mastermind UPC-to-NPP mapping; complete exact configuration eligibility matrix; official corroboration of DSG/other retail mappings; entry totals after parallel-only and multi-subject reconciliation; whether all pilot variants independently corroborate; definitive memorabilia scope. Beckett access is currently unavailable. Promotional source dates and revised checklists may disagree.

Known semantic conflicts: manufacturer guarantee versus retailer average wording must both survive; a retailer's release-wide Choice paragraph is not Hobby Mega eligibility; limited 'Hobby and Choice' overview coverage does not invalidate official retail/FOTL evidence. Per-signer serial differences are legitimate data, not necessarily errors. Missing standard rows and divergent third-party counts need review, not a convenient winner.

Implementation acceptance: approved bounded coverage is correctly labelled; 500 base identities/state survive; first-class subset/variant identities and serial rules work; configuration uncertainty is visible and never overstated; all requested filter forms work within disclosed coverage; canonical gallery/rights controls remain intact; deterministic generation and focused regression checks pass; no accounts, sales, valuation, finite tracking, EV, imagery acquisition, new product routes, Compare, monetization, paid service or Supabase introduced.

Completion after implementation: review diff, coherent commit(s), push origin/main, verify fetched and live GitHub SHA, Vercel Ready at that SHA, clean working tree, report counts/evidence/limitations and stop.

## Planning-task verification

For this prose-only task, review document consistency, source links, whitespace and the single-file diff. Application tests/build are not rerun because no application or data files change. Commit this plan only, push normally, fetch and compare main, origin/main and live remote main; confirm clean working tree. Stop for explicit approval. The pilot scope, grouping UX and legacy unspecified ownership treatment above are proposals for that approval, not implemented behavior.
