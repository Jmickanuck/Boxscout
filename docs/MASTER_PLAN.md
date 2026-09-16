# BoxScout Master Plan

Status: WORKING PLAN — collaborative product planning.
Last updated: 2026-09-15.
Initial planning baseline: `ea826fd051591a6b2784f9f89ff2159253f82b70`; this document incorporates the subsequent explicit decisions below. Read current repository state before implementation.

## How to use this plan

This is the strategic map, not a second execution authority. It connects the product outcome to the existing build sequence and records decisions still needed. It does not claim that planned capabilities are implemented.

- **Established** means supported by approved repository specifications or a recorded explicit product decision from Justin.
- **Proposed** means a planning recommendation, not a decision attributed to Justin.
- **Open** means the choice remains unresolved; do not silently select it during implementation.

[PHASE_1_STATUS.md](PHASE_1_STATUS.md) owns operational state and immediate sequencing. The single active execution plan owns implementation scope. [PRODUCT.md](PRODUCT.md), [DATA_INTEGRITY.md](DATA_INTEGRITY.md), [DATA_MODEL.md](DATA_MODEL.md) and [ARCHITECTURE.md](ARCHITECTURE.md) own their respective contracts. Later confirmed end-product requirements do not themselves expand an active coding task.

Plan 010 remains the only active build plan. Plans 011–015 retain their approved implementation order. The release-complete first-real-version target below is broader than the initial Mega pilot: completing that pilot or the existing plan numbers is not automatically completion of the first real version. Additional bounded plans must be scoped when their dependencies are ready.

Read this document for product planning, milestone preparation or an explicitly relevant task. Keep the compact startup path in [AGENTS.md](../AGENTS.md); do not add this entire plan to every coding session.

## 1. Product outcome

**Established:** BoxScout is a mobile-first soccer-card sealed-box buying intelligence platform. Its core question is:

> Which box should I buy, what should I pay, and where should I buy it?

**Confirmed audience — D05:** soccer-card collectors who want to understand what they are buying and whether better options exist before buying. This is not a beginner-only or expert-only product.

**Confirmed value direction — D08:** evaluate the current box price relative to the potential value of eligible pulls, including how verified surfaced finite chases change the available evidence. Estimated return is an intended analytics outcome, subject to supportable probabilities, comparable card values and uncertainty. A generic preference score or a lowest-price list alone does not fulfil that vision.

Support informed choices without pushing the collector toward a purchase or toward singles instead of boxes. Do not present opening boxes as reliable profit. Personal collecting interests remain relevant, but the principal value-comparison objective is economic rather than an arbitrary preference score.

The collector remains the primary user. Visual checklists, card prices, surfaced evidence, accounts and watchlists support discovery, evaluation and return visits; they do not turn BoxScout into a marketplace or primarily a collection manager. The compounding asset is the reviewed dataset and repeatable ingestion/review/publication system.

## 2. Established boundaries

- Golden Product #1 is **2026 Panini Prizm FIFA World Cup Soccer**. Mega is the first engineering pilot, not the full first-real-version scope.
- Shopper support prioritizes the **United States first, Canada second**, with the **United Kingdom as the next expansion candidate**. Shared card intelligence remains international.
- Keep release, box format, exact configuration, retailer offer, checklist entry, variant and physical finite instance distinct. Unknown eligibility is neither inclusion nor exclusion.
- Preserve canonical IDs, provenance, claim semantics and existing browser-local Owned/Watching. Public evidence absence is not proof a card remains sealed.
- Retain the modular monolith and canonical PostgreSQL -> approved snapshot architecture. Do not require live database requests for ordinary catalogue browsing.
- Preserve the approved four-column mobile gallery and themes. Public image rights and exact matching remain independent gates.
- Accounts and account-backed personal checklists/watchlists are required before the first real version under D09. Implement them through a separate bounded plan, not during Plan 010. Billing, broad scraping, opaque scores and manufacturer portals are not current work.
- Do not start Product #2 merely because the Mega pilot works. First deliver the complete-release target and genuinely useful purchase experience described below, or obtain an explicit scope revision.

Details remain in [PRODUCT.md](PRODUCT.md), [BOX_FIRST_UI_DIRECTION.md](BOX_FIRST_UI_DIRECTION.md), [UI_SPEC.md](UI_SPEC.md), [MONETIZATION.md](MONETIZATION.md) and [MANUFACTURER_INTEGRATIONS.md](MANUFACTURER_INTEGRATIONS.md).

## 3. Confirmed user journeys — D07

All three entry paths are part of the intended product; Justin did not choose just one.

| Entry path | Intended journey |
| --- | --- |
| Specific box | Find its exact configuration -> inspect contents, eligible cards, surfaced chases, current price and supported history -> compare alternatives |
| Budget | Browse boxes, identify those within budget, and compare their supported potential value relative to price. A natural-language recommendation wizard is not required |
| Club/card | Filter cards by club -> select a card and exact variant -> see which box configurations can contain it, with eligibility confidence |

All paths must reuse the same identities, evidence, market observations and comparison logic. The reverse card-to-box lookup must not turn release membership into exact-box eligibility. Club affiliation also requires its own data semantics; do not relabel a national-team card with an inferred or undated club relationship.

### Buying decision contract

| User task | Information required | Failure to prevent |
| --- | --- | --- |
| Identify the box | Exact configuration and listing mapping | Applying another version's pull structure to the offer |
| Understand contents | Source-qualified specifications, guarantees, averages and odds | Turning an average into a guarantee |
| Inspect eligible cards | Reviewed entries, variants and scoped eligibility | Treating a card's presence in the release as pullability |
| Inspect major chases | Explicit tracked scope and deduplicated finite evidence | Counting repeated listings as new cards or unseen copies as sealed |
| Assess price/history | Comparable dated observations, original currency and price basis | Calling asking-price history fair value or inventing pre-tracking history |
| Compare value | Defensible economic inputs and visible uncertainties | Treating surfaced percentage alone as remaining pull odds or expected return |

Lead box pages with useful purchase information and make deeper evidence available without overwhelming the page. Material uncertainty must remain visible where it changes interpretation.

## 4. Build sequence and release gates

The existing order remains active. Outcome descriptions clarify intent; each approved execution plan still controls its own implementation.

| Plan | Deliverable | Demonstration |
| --- | --- | --- |
| **010 — Release catalogue** | Reconciled subsets, entries, variants and coverage | Every source family accounted for; partial/unresolved data cannot appear complete |
| **011 — Mega identity and eligibility** | Exact configurations, seller mappings and pull relationships | Supported Mega boxes show appropriately qualified contents and eligibility |
| **012 — Box-first experience** | Mobile buying pages and supported price presentation | A collector can evaluate a supported box without navigating a research database |
| **013 — Finite-card evidence** | Selected major chases, instances and observations | Surfaced counts are traceable and deduplicated, with tracked scope explicit |
| **014 — Market intelligence** | Supported card sales, sealed offers and history | Evidence retains exact identity, date, currency and sale/listing semantics |
| **015 — Transparent comparison** | Inspectable comparisons and defensible modelling | Alternatives can be compared without invented probabilities or hidden assumptions |

Plan 010 can finish with explicit unresolved cases under its acceptance criteria; that does not mean the whole release is complete. Unresolved is not a shortcut around reconcilable work. Plan 012 must not invent Plan 014 market data, and Plan 015 can prove comparison within Golden Product #1.

### First real version — D11

Justin requires **at least one entire release's boxes and cards**, using 2026 Panini Prizm FIFA World Cup as the concrete target. The useful Mega pilot is an intermediate milestone, not this finished release experience. Account-backed personal checklists/watchlists must also be working before this gate under D09.

Inventory all source-identified card families, exact variants, box formats and distinct configurations for that release. Reuse the working pilot to extend coverage across the release; do not hand-build another database/page per box. Separate release membership, configuration coverage and eligibility completeness. US shopping comes first without silently deleting international configurations or duplicating shared cards.

Before declaring the release-complete target achieved, show measured coverage and disclose unresolved identities, mappings and families. Merely listing box names with empty detail pages is not the intended end product. Conversely, this requirement does not manufacture sold records, imagery, retailer stock or unpublished odds for every entity.

After the Mega slice is proven, scope bounded remaining-configuration coverage and integration/acceptance work before Product #2. Do not allocate speculative plan numbers or broaden Plan 010 into this whole programme. Account implementation needs a dedicated plan and must pass its acceptance checks before the first real version; it is no longer an optional post-release enhancement. A precise permitted-image coverage threshold remains open.

A successful mobile acceptance session covers the three entry paths: evaluate a box; compare options within a budget; find boxes containing a selected card. Users can inspect material limitations and make their own decision without another chat explaining the interface. Numerical estimated-return claims require their own data/model gate; no fake metric merely to satisfy a launch checklist.

Publication sharding and compact client projections remain the existing architecture direction. Follow [PUBLICATION_SHARDING.md](PUBLICATION_SHARDING.md) with measured, scoped changes rather than a new infrastructure programme.

## 5. Operational and analytical planning

### Source feasibility before automation

Prove a small real-data route before substantial integration. Record source access, permitted uses, exact identifiers/fields, freshness, failure behaviour, storage and manual-review needs. Public visibility is not a republishing license.

For card-market work, use [MARKET_DATA_STRATEGY.md](MARKET_DATA_STRATEGY.md). eBay is the first source to investigate, not a guaranteed feed. Storage, display, derived analysis and AI processing require appropriate permissions; do not assume licensed history belongs in public Git.

### Value model requirements

The old-box-versus-new-box example is a desired comparison, not a predetermined outcome. Show observed sealed prices/history, exact eligible chases, supported card values and verified surfaced evidence. Distinguish chase counts from value-weighted coverage and disclose the tracked universe.

Observed surfaced copies are not a census of opened cards. Remaining sealed supply, configuration allocation, collation and the unobserved opened population may be unknown. Depletion percentage alone cannot determine current odds. Keep original published odds separate from a hypothetical present-day model.

A future return estimate must distinguish expected gross card value, net proceeds after supported costs, box outlay and profit/ROI. Do not call a chase-only subtotal a whole-box expectation, use graded prices for assumed raw pulls, or equate an average outcome with a typical or guaranteed outcome. Ranges/scenarios need stated assumptions; unsupported inputs remain unknown. Exact formulas and publication thresholds require a later tested plan.

### Sustainable operating cost and workload — D03/D01

**Confirmed budget direction:** ongoing application costs should stay under approximately **$100/month**, with an eventual objective of at least covering those costs through revenue. Justin did not specify the currency; record it as unresolved rather than assuming USD from the shopper market. This is a planning ceiling, not permission to purchase any subscription or a target to spend in full.

Keep development subscriptions conceptually separate. Budget application hosting, storage, backups, image delivery, licensed data, refresh processing and eventual account/email operations together, including relevant currency/tax and renewal context before approving spend. Do not choose a provider whose data cost consumes the ceiling without accounting for other services. Breaking even is an objective, not a revenue forecast or a reason to bypass demand validation.

Routine maintenance time remains unanswered. The earlier one-hour-per-week suggestion is still a hypothesis, not Justin's commitment. Measure review time, exceptions, repeat corrections and failed sources. Deterministic software handles bulk work; AI/human review handles consequential ambiguity. Grow coverage only when measured cost and workload support it.

### Freshness, images and operational safety

Set source-specific offer freshness and stale-data policies before market summaries. Preserve original dates and original amounts; running a refresh does not create a new historical sale. Do not fabricate history from before permitted observations exist.

The image pipeline and the visual experience are separate readiness gates. Full boxes/cards listed does not itself specify a percentage of licensed images or guarantee sale history for every card. Retain intentional placeholders and obtain a practical image-acceptance target before claiming visual readiness.

Scheduled off-device backup and tested recovery are prerequisites for irreplaceable evidence, market history and account data. Follow [PERSISTENCE_RUNBOOK.md](PERSISTENCE_RUNBOOK.md). Asset retention/withdrawal is separate from database recovery. Do not select paid services without approval.

Actual unattended ingestion needs executable jobs, monitoring, failure reporting and review/publication controls. A chat or local development PC is not an unattended production service. Activate homepage modules only when real data supports them.

### Return visits and accounts — D09

Confirmed return reasons: log into an account, update a personal checklist, view a watchlist and browse for the next box. **Justin subsequently confirmed on 2026-09-15 that account functionality belongs before the first real version.** Account-backed checklists/watchlists are therefore a release requirement, not merely future intent. News, notifications and automatic alerts were not selected as mandatory features by this answer.

The initial account experience should remain focused on sign-up/sign-in/sign-out, a saved personal checklist and watchlist accessible across devices, and account recovery/deletion. The detailed minimum scope and release checks are in [PRODUCT.md](PRODUCT.md#personal-accounts-and-return-visits--decision-d09); do not expand into social or portfolio features to satisfy this decision.

Preserve local Owned/Watching now. Account-backed persistence needs a later bounded plan for user isolation, recovery/deletion, private storage, a consented local-state import and operating cost. Personal ownership/watch flags never become canonical facts or verified surfaced evidence automatically. Do not store private user data in public Git or gate ordinary box research behind a login merely because accounts exist.

Manufacturer foundations and the existing affiliate/Pro/B2B sequence remain supporting strategies, subject to source rights, independence and demand gates.

## 6. Decision register

All decisions below were supplied in the 2026-09-15 planning conversation. Open choices are not blockers for Plan 010.

| ID | Decision | State / application |
| --- | --- | --- |
| D01 | Routine review/maintenance time | OPEN; about one hour/week remains an unconfirmed design hypothesis |
| D02 | Shopper geography | DECIDED: US first, Canada second, UK next expansion candidate; shared international intelligence |
| D03 | Operating budget and objective | CONFIRMED: under approximately $100/month, eventual cost recovery; currency and individual spending approvals unresolved |
| D04 | Image coverage acceptance | OPEN: full boxes/cards listed is required under D11, but an exact permitted-image coverage threshold was not supplied |
| D05 | Audience | DECIDED: informed soccer-card purchase decisions, neither beginner-only nor expert-only |
| D06 | Marketplace data | CONFIRMED VISION: card prices/sales from eBay or other popular venues; integration, rights, cost and methodology remain subject to feasibility |
| D07 | Entry journeys | CONFIRMED: specific-box evaluation, budget browsing/comparison and club/card -> eligible-box discovery |
| D08 | Better value | CONFIRMED: lower box price relative to eligible pull-value potential, considering surfaced chases; estimated return is an intended, evidence-gated model, not an arbitrary score |
| D09 | Return visits/accounts | DECIDED: accounts with saved personal checklists/watchlists are required before the first real version; separate bounded implementation plan, not Plan 010 |
| D10 | Role of singles | DECIDED: subordinate information about card prices and acquisition routes; do not push singles over boxes; choice belongs to the collector |
| D11 | First real version | CONFIRMED: at least one whole release's boxes and cards, not only one Mega configuration, plus D09 accounts; full-release and account acceptance gates before Product #2 |

The earlier Canada-first proposal is superseded. D05 does not require a beginner/expert choice. D08 rejects defining value solely by personal preference; interests still guide discovery. D10 rejects making buy-the-single redirection the default product behaviour. D11 raises the release target without requiring invented missing data. D09's earlier open launch-timing question is resolved: accounts must precede the first real version.

Open questions should be resolved only as their dependencies approach: budget currency before spending, image threshold, and sustainable maintenance. Do not ask Justin to reconfirm account launch timing, the established journeys, value objective, target release or regional priority.

## 7. First bounded desktop handoff

**Plan 010, first slice: source inventory and coverage contract.** This subdivides the existing active plan; it is not a new parallel plan or release-completion claim.

Read [AGENTS.md](../AGENTS.md), its compact startup context and [Plan 010](exec-plans/active/010-complete-golden-product-release-catalogue.md). Follow applicable parts of [ASTRA_RUNBOOK.md](ASTRA_RUNBOOK.md). Fetch remote state, inspect local changes and existing parsers/manifests before adding code. Do not overwrite uncommitted PC work or assume an earlier baseline is current.

Objective: establish which source subset families exist and how source-observed/expected, canonical and unresolved coverage will be represented reproducibly.

Expected output:

1. Source-backed subset inventory with locators, source identity/hash, classification, count semantics and unresolved cases.
2. Deterministic compact coverage report/prototype with tests for missing families, unresolved totals and unknown denominators. Process bulk files with code, not model context.
3. Concise discrepancy ledger and next reconciliation slice. Record measured state in the active plan/status without claiming complete release coverage.

Do not redesign the UI, add accounts, expand products/configurations outside Plan 010, implement valuation, overwrite canonical data, buy services or publish candidate coverage as verified. Do not force a schema change where existing structures suffice; use the plan's migration/review rules for real changes.

Subsequent slices reconcile approved entries, reconstruct variants, enforce publication/coverage gates, then verify database parity and mobile regressions. Slice completion is not Plan 010 completion, and Plan 010 completion is not first-real-version completion.

Run applicable lint/typecheck/tests/build and database checks when affected, review the diff, commit/push and verify the remote. Report exact SHA, checks actually run, remaining discrepancies and next unfinished slice. Never infer remote success from a local commit alone.

## 8. Documentation and collaboration

Justin owns product choices and acceptance. This planning workspace turns them into scoped requirements. The desktop agent owns routine technical choices within the architecture, small tested changes and repository updates.

Do not duplicate live catalogue counts here. Use the publication manifest and operational status. Do not write detailed future implementation instructions before source feasibility and earlier dependencies are known.

Each handoff needs an outcome, allowed scope, inputs, data/UI contracts, acceptance checks and stop conditions. Advance one coherent slice at a time.

Known cleanup when the relevant contract is edited:

- `UI_SPEC.md` retains earlier opt-in and later included-by-default probable-eligibility behaviour. Label history/current/next behaviour rather than silently switching the default.
- `DATA_MODEL.md` mixes bootstrap direction and implemented refinements; separate current contracts, future work and history.
- `ASTRA_RUNBOOK.md` retains bootstrap language; current status/plan still govern implementation.

Preserve history while eliminating conflicting current instructions. Do not use documentation work to authorize broad application refactoring.