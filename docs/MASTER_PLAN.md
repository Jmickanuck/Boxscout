# BoxScout Master Plan

Status: WORKING PLAN — collaborative product planning.
Last updated: 2026-09-15.
Baseline reviewed: `ea826fd051591a6b2784f9f89ff2159253f82b70`.

## How to use this plan

This is the strategic map, not a second execution authority. It connects the product outcome to the existing build sequence and records decisions still needed. It does not claim that planned capabilities are implemented.

- **Established** means already supported by the current approved repository specifications.
- **Proposed** means a planning recommendation, not a decision attributed to Justin.
- **Open** means the choice remains unresolved; do not silently select it during implementation.

[PHASE_1_STATUS.md](PHASE_1_STATUS.md) owns current operational state and sequencing. The single active execution plan owns implementation scope. [PRODUCT.md](PRODUCT.md), [DATA_INTEGRITY.md](DATA_INTEGRITY.md), [DATA_MODEL.md](DATA_MODEL.md) and [ARCHITECTURE.md](ARCHITECTURE.md) own their respective contracts. This document does not override them.

Plan 010 remains the only active build plan. Plans 011–015 are the existing approved sequence, not permission to start those features now. New recommendations below need to be incorporated into the appropriate approved execution plan before implementation. The start of this planning exercise does not approve spending, new infrastructure, a roadmap reorder or every proposed target.

Coding agents should read this document only for product planning, milestone preparation or an explicitly relevant task. Keep the compact startup path in [AGENTS.md](../AGENTS.md); do not add this entire plan to every coding session.

## 1. Product outcome

**Established:** BoxScout is a mobile-first soccer-card sealed-box buying intelligence platform. Its core question is:

> Which box should I buy, what should I pay, and where should I buy it?

**Working product promise:** Help a collector choose a sealed product that fits their budget and interests, understand what is actually eligible to be pulled, inspect the price and finite-chase evidence, and make a better-informed decision.

A useful outcome may be buy, choose another version, wait or skip. Opening a box should not be presented as a reliable financial return. Do not optimize the product solely for getting an outbound purchase click.

The collector is the primary user. Checklists, visual card browsing, market observations and manufacturer participation support the buying decision; they do not replace it. The compounding asset is the reviewed dataset and repeatable ingestion/review/publication system, not a growing collection of hand-built product pages.

## 2. Established boundaries to preserve

- Golden Product #1 is **2026 Panini Prizm FIFA World Cup Soccer**, with Mega first. Do not revert to an older proposed benchmark.
- Keep release, box format, exact configuration, retailer offer, checklist entry, variant and physical finite instance distinct. Unknown configuration eligibility is not exclusion or inclusion.
- Preserve canonical IDs, provenance, claim semantics and browser-local Owned/Watching. Public evidence absence is not proof a card remains sealed.
- Retain the modular monolith and canonical PostgreSQL -> approved snapshot architecture. Do not require live database requests for ordinary catalogue browsing.
- Preserve the approved four-column mobile gallery and theme direction. Public image rights and exact matching remain independent gates.
- Product #2 follows a genuinely useful Golden Product. Accounts, billing, broad scraping, opaque value scores and manufacturer portals are not current work.

Details remain in the linked specifications rather than being copied here. In particular, follow [BOX_FIRST_UI_DIRECTION.md](BOX_FIRST_UI_DIRECTION.md), [UI_SPEC.md](UI_SPEC.md), [MONETIZATION.md](MONETIZATION.md) and [MANUFACTURER_INTEGRATIONS.md](MANUFACTURER_INTEGRATIONS.md).

## 3. Reverse-engineered buying journey

| User task | Information the system must establish | Failure to prevent |
| --- | --- | --- |
| Identify the box | Exact configuration and the listing-to-configuration relationship | Applying another version's pull structure to this offer |
| Understand the contents | Source-qualified specifications, guarantees, averages and published odds | Turning an average into a guarantee or unknown odds into an estimate |
| Inspect eligible cards | Reviewed release identities, exact variants and scoped eligibility | Treating release membership as pullability |
| Inspect major chases | Explicit tracked scope and deduplicated finite-instance evidence | Counting repeated listings as different cards or calling unseen copies sealed |
| Assess a price | Comparable dated observations, currency, offer/sale distinction and delivery uncertainty | Calling a stale asking price current market value |
| Compare alternatives | Transparent inputs, limitations and relevance to the collector | Manufacturing an overall winner when evidence is insufficient |

The intended box page leads with exact identity, useful observed pricing, purchase destinations, contents and eligible chases. Research detail belongs underneath, but uncertainty that could change a purchase must remain visible at the relevant point.

## 4. Existing build sequence, expressed as outcomes

The order below is established. The outcome descriptions clarify intent; the active plan's acceptance criteria still control completion.

| Plan | Deliverable | What it must demonstrate |
| --- | --- | --- |
| **010 — Release catalogue** | Reconciled subsets, entries, exact variants and machine-readable coverage | Every source family is accounted for; partial or unresolved coverage cannot appear complete |
| **011 — Mega identity and eligibility** | Exact configurations, seller mappings and evidence-backed pull relationships | Each supported box shows only appropriately qualified contents and eligible variants |
| **012 — Box-first experience** | Mobile buying pages and supported price presentation | A collector can evaluate the supported box without navigating a research database |
| **013 — Finite-card evidence** | Selected major chases, instances, observations and evidence | Surfaced counts are traceable and deduplicated, with tracked scope explicit |
| **014 — Market intelligence** | Supported card sales, sealed offers and historical observations | Price evidence retains exact identity, date, currency and sale/listing semantics |
| **015 — Transparent comparison** | Inspectable comparisons and only defensible modelling | Alternatives can be compared without concealing uncertainty or inventing probabilities |

Plan 010 does not require pretending all source disagreements are solvable. Its existing acceptance criteria allow explicit unresolved states while requiring all resolvable approved families to be reconciled. Unresolved is not a shortcut around work that can actually be completed.

Plan 012 must not invent the data intended for Plan 014. Plan 015 can prove comparison using supported configurations within Golden Product #1. Neither requires bypassing the Product #2 gate.

Release/domain publication sharding and compact client projections remain the existing architecture direction, not a new infrastructure programme. Performance changes must be measured and scoped through [PUBLICATION_SHARDING.md](PUBLICATION_SHARDING.md) and the active plan.

## 5. Proposed planning refinements

These are candidates for future task acceptance criteria, not authorization to build additional systems during Plan 010.

### Source feasibility before automation

For each new data domain, prove a small real-data path before substantial implementation. Record the source, access and permitted-use constraints, exact identifiers/fields available, freshness needs, failure behaviour, storage requirements and expected manual review. Discovery or public visibility alone does not establish permission to republish.

A source that cannot be accessed reliably is a product constraint. Do not respond by inventing values or quietly bypassing access restrictions.

### Sustainable review workload

Measure routine review time, exceptions per import, repeat corrections and source failures. Use deterministic code for parsing, joins, counting and exact comparisons; use AI for bounded ambiguity. Present compact review batches rather than asking Justin to inspect thousands of records.

The suggested target of **at most about one hour per week of routine maintenance** is an unconfirmed design hypothesis, not Justin's stated commitment or an achieved result. Development time and optional hobby research are separate. Coverage should grow only as the observed workload supports it.

### Price freshness and source failure

Before implementing market summaries, define which observations qualify, how stale offers are labelled or excluded, how unavailable sources behave, and which currency/shipping/tax assumptions are visible. Preserve original event and observation dates; a refresh must not make an old sale look new. Thresholds require a source-specific decision, not an invented universal expiry.

### Imagery and presentation readiness

Separate **image pipeline ready** from **visual experience ready**. A safe pipeline with zero approved images can satisfy a foundation task without demonstrating a finished image-led experience. Agree a practical permitted-image target for the supported shopping journey before claiming visual readiness. Missing images remain intentional placeholders; rights do not become optional.

Activate homepage intelligence modules only when real, sufficiently current data supports them. Do not build empty activity feeds to imitate a mature platform.

### Operational prerequisites

The existing off-device scheduled-backup requirement must be an explicit dependency before irreplaceable surfaced evidence, market history or user data is stored. Use [PERSISTENCE_RUNBOOK.md](PERSISTENCE_RUNBOOK.md); do not select a paid provider without approval. Asset backup and rights withdrawal require their own treatment, separate from database recovery.

Before promising continuous data refresh, define executable jobs, monitoring, failure reporting and publication review. A chat session or a local development PC is not an unattended production service.

### User acceptance and expansion

Proposed acceptance exercise: on a phone, evaluate a supported box, understand its material uncertainties, compare a supported alternative, and choose buy/wait/skip without requiring another chat to explain the interface.

Record evidence from several real evaluations before expansion: what helped, what remained confusing or missing, whether displayed information was correct, and the maintenance cost. Do not require a purchase to count the exercise as successful. Exact targets remain to be agreed; catalogue size alone is not a success metric.

Manufacturer foundations should strengthen this experience without making a partnership a prerequisite for all progress. Follow the existing M0–M5 sequence. Affiliate experimentation and Pro demand validation retain their existing gates; no revenue or willingness-to-pay claim is established by this plan.

## 6. Open decisions

Only record an answer as decided after Justin actually supplies or accepts that specific choice. An unanswered recommendation remains proposed. These questions do not block catalogue reconciliation.

| ID | Decision | Current position | Resolve before |
| --- | --- | --- | --- |
| D01 | Maximum routine weekly review/maintenance | Open. Proposed design target: about one hour; distinguish optional research and development | Setting sustained ingestion breadth/cadence |
| D02 | First shopper geography | Open. Proposed: Canadian purchase support first, while retaining original currencies and exact US/other configuration identities | Offer discovery, seller coverage and comparison scope |
| D03 | Ongoing paid source/infrastructure budget | Open. No new spend authorized; distinguish application costs from development subscriptions | Any paid source/service commitment |
| D04 | Minimum image coverage for a useful visual pilot | Open. Rights-safe infrastructure is not itself the visual acceptance target | Claiming the image-led experience ready for broader use |

Canada-first purchase support would not mean deleting US product facts or preventing a US visitor from browsing. A Canada-and-US launch would require separately supported seller availability, currencies and delivery context; it is a larger maintained shopping scope.

Next discussion: D02, followed by the remaining decisions as their dependencies approach. Do not re-ask established choices such as the Golden Product, box-first purpose, four-column mobile gallery or local-only Owned/Watching.

## 7. First bounded desktop handoff

**Plan 010, first slice: source inventory and coverage contract.** This is a proposed subdivision of the existing active plan, not a new parallel plan or a replacement acceptance gate.

Read [AGENTS.md](../AGENTS.md), the compact startup context and [Plan 010](exec-plans/active/010-complete-golden-product-release-catalogue.md). Follow the relevant parts of [ASTRA_RUNBOOK.md](ASTRA_RUNBOOK.md). Fetch remote state, inspect local changes and inspect existing parsers/manifests before adding code. Do not overwrite uncommitted PC work or assume this reviewed baseline is still current.

Objective: establish which source subset families exist and how expected/source-observed, canonical and unresolved coverage will be represented reproducibly.

Expected output:

1. A source-backed subset inventory with locators, source identity/hash, classification, count semantics and explicit unresolved cases.
2. A deterministic compact coverage report/prototype plus tests for missing families, unresolved totals and unknown denominators. Existing bulk files should be processed by code, not loaded into model context.
3. A concise discrepancy ledger and proposed next reconciliation slice. Record measured state in the active plan/status without claiming release completion.

This slice must not redesign the UI, expand products, resolve disputed identities by guessing, overwrite canonical data, introduce paid services or publish a candidate report as verified catalogue coverage. Do not force a schema change if existing structures can support the inventory. Any necessary change must remain within Plan 010 and use its review, migration and integrity rules.

Subsequent slices follow the active plan: reconcile approved entries, reconstruct exact variants, enforce coverage/publication gates, then verify database parity and mobile regressions. Slice completion is not Plan 010 completion.

For implementation, run applicable lint/typecheck/tests/build and database checks when affected, review the diff, commit/push and verify the remote. Report the exact SHA, checks actually run, remaining discrepancies and next unfinished slice. Never infer success from a local commit alone.

## 8. Documentation and collaboration discipline

Justin owns product choices and acceptance. The planning conversation turns those choices into scoped requirements and reviews outcomes. The desktop implementation agent owns routine technical decisions within the approved architecture, small tested changes and repository updates.

Do not duplicate current catalogue counts here; use the publication manifest and operational status. Do not write detailed future code instructions before source feasibility and preceding milestones are known.

For each substantial handoff, state the outcome, permitted scope, required inputs, data/UI contracts, acceptance checks and stop conditions. Advance one coherent slice at a time rather than sending a broad instruction to finish the whole application.

Known documentation cleanup to address when the relevant contract is edited:

- `UI_SPEC.md` contains an earlier probable-eligibility opt-in rule and a later Plan 009 included-by-default rule. Separate historical behaviour from the current and next approved interaction contract; do not silently pick a different default.
- `DATA_MODEL.md` mixes prospective bootstrap descriptions with later implemented refinements. Label current contracts, future directions and history explicitly.
- `ASTRA_RUNBOOK.md` retains some bootstrap-era language. Follow the current status and active plan; do not interpret old text as requiring a second backend or undoing persistence.

This master-plan change does not itself rewrite those specifications. When cleaning them, preserve prior decisions/history, document actual semantic changes, and avoid broad application refactoring under a documentation task.
