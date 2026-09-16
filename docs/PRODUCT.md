# BoxScout Product Specification — Phase 1 and End-Product Direction

## Product

BoxScout is a mobile-first soccer-card **sealed-box buying intelligence platform**.

Its primary purpose is to help a collector decide:

> **Which box should I buy, what should I pay, and where should I buy it?**

Cards, checklists, variants, odds, sales and surfaced finite hits are the intelligence inputs that explain whether a sealed box is attractive. BoxScout is not primarily a collection manager or checklist database.

See `PRODUCT_AUDIT_2026-09-15.md` for the audit that established this box-first direction. Confirmed end-product intent below does not authorize implementing every feature during the current Plan 010 task. Current implementation state remains in `PHASE_1_STATUS.md`.

## Primary collector — Decision D05

**Confirmed by Justin on 2026-09-15:** the target user is the soccer-card collector who wants to know more about what they are buying and whether better options exist before buying.

This defines a purchase need, not a beginner-only or expert-only audience. Explain meaningful differences in understandable language, with deeper odds, checklist, market and evidence detail available when useful. Do not make specialist vocabulary a prerequisite or turn the main interface into a tutorial.

Support the collector's own decision. Personal checklist/account features may support return visits under D09 without making collection management the primary product or expanding into professional-breaker software or speculative investing tools.

## Phase 1 goal and first real version — Decision D11

Build a V0 that Justin personally uses when evaluating soccer-card sealed products before spending money. The engineering pilot does not require revenue.

**Confirmed minimum for the first real version:** at least one entire card release's boxes and cards, using **2026 Panini Prizm FIFA World Cup Soccer** as the target. A single supported Mega configuration or a partial checklist is an intermediate pilot, not that finished release experience.

The release target includes a source-backed inventory of its card subsets, exact variants, box formats and distinct configurations, useful box/card pages, and evidence-qualified links between exact variants and boxes. A list of box names with otherwise empty pages does not satisfy the intended experience. Keep regional retailer coverage separate from release coverage: US shopping is first, while shared card/configuration identities remain correctly represented.

Use machine-readable coverage to distinguish release completeness, configuration coverage and eligibility completeness. Unknown or disputed families must remain visible and block unsupported full/complete claims; do not silently omit them to pass a launch gate. Plan 010 may finish its reconciliation work with explicit unresolved records under its own criteria without claiming this broader launch is complete.

Complete catalogue coverage does not mean a sale record, approved image, published odds or current retailer offer exists for every entity. Do not fabricate those. The precise acceptable licensed-image coverage and whether accounts are required at this first-real-version gate remain open decisions.

Keep Mega first, then reuse the proven pipeline and components across the remaining release configurations through bounded follow-on plans. Do not begin Product #2 merely because the Mega pilot or Plans 010–015 are finished. Full-release scope and genuine buying usefulness must be demonstrated, or a scope revision explicitly agreed.

## Confirmed discovery journeys — Decision D07

All three routes belong in the end product:

1. **Box first:** inspect an exact box, contents, eligible cards, verified surfaced chases, observed current price and supported price/history information, then examine alternatives.
2. **Budget first:** browse boxes, identify options within budget and compare their supported potential return relative to price. A budget filter and transparent comparison are an implementation proposal; a conversational recommender or mandatory wizard is not required.
3. **Club/card first:** filter cards by club, select a card and exact variant, then see the box configurations that could contain it with appropriately qualified eligibility.

These are views over shared canonical data, not separate catalogues. The reverse lookup must use exact VariantEligibility, preserve UNKNOWN/PROBABLE/VERIFIED distinctions and expose its coverage limitations. Selecting a checklist entry with multiple variants must not imply that every listed box contains every variant.

Club filtering requires an explicit semantics decision in the implementing plan: the club depicted on the card is not automatically the player's current club, and a national-team card must not be relabelled as a club card. A separate player-to-club association, if used for discovery, needs source/time context and distinct presentation. Handle multi-subject entries without inventing a single club. Do not infer current affiliations from old cards or invent missing club data.

Browsing within budget should not rank a box with unavailable market data as free or good value. Preserve original currency, price basis, date, seller availability and delivery uncertainty.

## Shopper market priority — Decision D02

**Approved by Justin on 2026-09-15:** prioritize shopping support for the **United States first, Canada second**, with the **United Kingdom as the next expansion candidate**. This replaces the earlier Canada-first proposal. It does not change the Golden Product or active execution sequence, and is not a sourced claim about comparative market size, manufacturer nationality or proven demand.

### Buying support is regional; card intelligence is shared

- Prioritize credible US-serving retailer offers, supported US configurations and USD presentation when the relevant shopping/market plans are implemented. Country of retailer, shipping destination, box configuration/channel and transaction currency are distinct facts.
- Preserve one canonical identity for each release, entry, variant and physical finite instance. A verified sighting in Canada, the UK or elsewhere still counts toward the same tracked physical card; do not create separate country-specific surfaced totals for that card.
- Global sightings and market observations may inform research, but market comparisons must preserve venue, country/currency context and comparability. A foreign asking price is not automatically a US market price.
- Do not assume identically named regional boxes have identical contents, odds or eligible variants. Retain exact configuration identities and evidence-backed relationships.
- International visitors may browse shared intelligence. Prioritizing US shopping does not require geoblocking or promise local retailer coverage for every visitor.

### Price and offer contract for upcoming plans

The first fully supported shopping experience should default to the US market and USD, with clear market context. Design later region and currency preferences as separate concerns: changing display currency does not change delivery eligibility or create supported local offers.

Always retain the original amount, currency, observation timestamp and source. Use unambiguous currency labels when observations differ. A future converted display value is a derived estimate with its rate source/time, not a replacement for the original transaction or asking price. Do not invent an exchange rate or silently relabel existing CAD observations as USD.

Where to buy must distinguish the seller's item price from supported shipping, tax and any cross-border costs. Unknown costs or destination availability remain unknown, not zero or assumed. A lowest observed item price is not necessarily the lowest delivered total. Do not claim local store inventory without location-specific evidence.

Canada is the next shopping expansion, reusing shared catalogue/evidence data while adding supported Canadian offers and pricing context. Investigate UK buyer demand, source access and retailer/delivery coverage before committing to a UK launch. Regional completeness and maintenance capacity, not a flag or currency selector alone, determine supported-market claims.

### Implementation boundary

Apply this contract when scoping Plan 011 identity/eligibility, Plan 012 buying UI, Plan 014 market observations and Plan 015 comparison. Plan 010 remains focused on release reconciliation and honest coverage. Existing Canadian pilot listings, CAD observations, IDs and provenance must survive unchanged; they are not obsolete facts merely because the target audience changed.

No new paid service, automatic currency conversion, region selector, regional catalogue expansion or retailer integration is authorized to bypass its appropriate execution plan. See `MASTER_PLAN.md`, decision D02, for the recorded choice.

## Phase 1 success

The V0 should ultimately allow a user to:

1. Browse supported soccer releases and sealed box formats.
2. Understand the known versions/configurations of a box format.
3. Open a specific box/configuration.
4. See current/observed sealed pricing and credible places to buy it.
5. Understand the box configuration, contents and defensible hit rules/frequencies.
6. Understand what exact cards/variants are eligible to be pulled from that configuration.
7. See major eligible chases and finite-card surfaced status with evidence/confidence.
8. Browse/search/filter the underlying set visually when deeper inspection is useful.
9. Mark cards Owned and Watching without mixing personal state into canonical facts.
10. Compare boxes using transparent metrics, including options within a budget.
11. Find supported boxes from a selected card/variant, including the club discovery route where the data supports it.
12. Eventually see defensible estimated-return and box-value models only after probability and market assumptions are supportable.

The small catalogue goal is depth in Golden Product #1, not a permanently partial release. Apply the D11 first-real-version gate separately from individual engineering-plan completion.

## Golden Product #1

**2026 Panini Prizm FIFA World Cup Soccer**

The Golden Product is the release plus its sealed configurations, with Mega as the first shopper-facing format to make trustworthy end-to-end. Other configurations remain part of the full-release target rather than a different Product #2.

This release is deliberately complex and should force the system to model:

- release/set vs box format
- exact box version/configuration/SKU
- retailer listing/offer vs canonical configuration
- possible evidence-backed pull-profile grouping
- configuration-exclusive parallels
- base checklist
- inserts
- autographs
- exact variants
- finite numbered cards
- visual checklist
- chase tracking
- evidence/provenance
- sealed pricing

## Canonical product hierarchy

Use these terms consistently:

```text
Release / Set
  -> Box Format
      -> Box Version / Configuration
          -> Retailer Listing / Offer

Release / Set
  -> Card Subset
      -> Checklist Entry
          -> Variant
              -> future FiniteInstance
```

Examples:

- Release / Set: `2026 Panini Prizm FIFA World Cup`
- Box Format: `Mega`, `Hobby`, `Blaster`, `Choice`, `FOTL`
- Box Version / Configuration: `NPP Mega`, `Target Mega`, `DSG Mega`, `Hobby Mega`
- Retailer Listing: an exact retailer SKU/UPC/price observation
- Card Subset: `Aces`, `Signatures`, `International Ink`

Do not call box versions/configurations card "subsets."

### Pull Profile

A future/internal Pull Profile may group exact configurations proven to share materially the same pull pool and hit structure. Similar pack counts or copied retailer language are not enough to establish equivalence. Preserve exact identifiers and evidence even when configurations are grouped for the shopper-facing experience.

## Core user surfaces

### Home — intelligence dashboard

The mature homepage should feel like a collector intelligence dashboard rather than a static marketing landing page.

When supported by real data it may surface:

- search for releases/boxes/players/chases
- featured boxes
- new/notable releases
- latest major verified surfaced pull
- latest major verified card sale
- meaningful sealed-price moves
- boxes with interesting remaining chase landscapes
- recent BoxScout data updates
- later, personal watched/saved-box activity

Useful intelligence should appear high on the mobile viewport. Static marketing copy should become compact once real data exists. Under D09, returning to a checklist/watchlist and browsing the next box are confirmed use cases; this does not make an automated news feed or notifications a mandatory launch feature.

### Release / Set

Purpose: help the user understand the ways they can buy/open the release.

Show box formats first. Each format should eventually support decision-relevant summaries such as:

- typical/average sealed price
- cheapest credible offer
- packs/cards
- important guarantees or per-box averages
- known versions/configurations
- notable exclusives
- headline chase/surfaced information

The card checklist is a drill-down from the release, not the primary purpose of the page.

### Box Format

Purpose: compare materially different versions/configurations of the same shopper-recognizable format.

Example: Mega may contain NPP, Target, DSG and Hobby Mega versions.

For each supported version/configuration, eventually show:

- exact identity/channel context
- average sealed market price
- cheapest credible offer
- box contents/hit structure
- exclusive or characteristic parallels
- defensible autograph/numbered/case-hit frequencies
- top eligible chases
- finite surfaced status
- coverage/confidence state

### Box / Configuration Overview

This is BoxScout's core purchase-decision surface.

Answer, in order:

1. What box is this exactly?
2. What does it cost now / what price evidence do we have?
3. Where can I buy it from a credible seller?
4. What do I get in the box?
5. What are my defensible hit frequencies or guarantees?
6. What are the best cards eligible in this exact box?
7. Which important finite hits have publicly surfaced?
8. What meaningful upside is publicly unaccounted for?
9. How does this compare with alternatives?

Do not bury purchase information below marketing copy. Show supported sealed-price history when available, distinguishing observed listing prices, sale history and any modelled value. Do not fabricate a chart reaching back to release if permitted historical records are absent.

### Cards

The visual checklist is an important supporting intelligence surface:

- four columns on mobile
- card image/intentional placeholder
- card number
- player/display name
- search
- filters, including evidence-backed club discovery when implemented
- Owned
- Watching
- exact variant drill-down
- reverse links to eligible boxes from the appropriate detail view

Its purpose is to let the user inspect what exists, what it may be worth on the available evidence, and where it can be pulled. It must not make BoxScout feel primarily like a collection-management app. Preserve the compact tile rather than adding price/history panels to every tile without a separate UI decision.

### Chases

Track major eligible cards/variants with:

- exact card/variant identity
- serial total where finite
- box/configuration eligibility
- surfaced status
- evidence/confidence
- supported market value when later available

Never claim that a card with no public evidence is definitely still sealed. A surfaced date records discovery/reporting context and is not automatically the original opening date.

### Compare

Compare boxes using transparent, inspectable metrics.

Examples:

- current sealed price
- cheapest credible offer
- numbered-card frequency where known
- autograph frequency where known
- configuration-exclusive chase information
- tracked major chases
- finite surfaced percentage/counts
- supported chase value distribution

The principal objective is price relative to eligible pull-value potential (D08), not an arbitrary preference score. Personal club/player preferences remain filters and collecting context. Do not claim rigorous expected value until the model gate below passes.

## Personal accounts and return visits — Decision D09

**Confirmed end-product intent:** users can return, log into an account, update their personal checklist, inspect a watchlist and browse the next box they want. An account-backed checklist/watchlist is part of the intended product, not automatically a full portfolio-management suite.

The current pilot remains browser-local Owned/Watching. Whether account login is required in the first real version, rather than a subsequent release, remains undecided. Do not add authentication or subscriptions during Plan 010 or reinterpret existing flags as public ownership evidence.

Before implementing accounts, create a bounded plan covering identity/access control, per-user isolation, private storage, recoverability/deletion, and explicit migration/import of existing local flags. Preserve stable variant IDs and resolve local/cloud conflicts without silent loss or parallel fan-out. Account data must never enter a public catalogue snapshot or public Git.

A private Owned/Watching flag is not verified surfaced-card evidence. Public evidence submission would require a separate consent/review path. Ordinary box research should remain accessible without account creation; alerts, social features, detailed acquisition accounting and billing are not implied by this decision.

## Sealed-price intelligence

Sealed-box price is a core BoxScout data domain, not decorative retailer copy.

Eventually distinguish:

- active retailer/listing asking price
- recent verified sealed sale
- average/median credible listing price
- cheapest credible active offer
- historical price observations
- currency
- shipping/tax/availability only when actually supported
- source and observation date/time

Do not let a single absurd asking price define market value. Listing observations and completed sales are separate fact types.

## Marketplace-backed card information — Decisions D06 and D10

**Confirmed vision from Justin on 2026-09-15:** cards should show price and sold-card information sourced from eBay or other popular card-selling marketplaces. eBay is the first source to investigate, not an exclusive supplier or an already connected feed. This makes the existing sales/valuation direction more explicit; it does not authorize immediate ingestion or spending.

**D10 — singles remain subordinate:** show supported card prices and how to get the card, including eligible sealed boxes and relevant marketplace listings. Do not make "buy the single instead" the default recommendation, promote singles over boxes, or optimize the interface to steer that choice. The collector decides. This does not prohibit neutral links to actual card listings or evidence that informs a comparison.

The proposed exact-variant detail experience separates **recent matching sales**, **current listings**, and **any supported estimate/history**. Keep source links, dates, sample coverage and condition/grade context visible. Raw and different grading-company/grade results are distinct comparable groups, not one pooled card price. Thin data should produce a few qualified observations or insufficient-evidence wording, not a fabricated value. The existing four-column gallery remains unchanged until a separate UI decision is made.

Market observations must match the exact card/parallel and preserve their original price basis. An asking price or active bid is not a sold price; an ended listing is not necessarily a sale; a reported sale is not independent proof of payment. Provider estimates remain separate from actual transactions. Duplicate reports of the same transaction count once; later genuine resales remain separate events but must not inflate finite surfaced-copy counts.

Before Plan 014 implementation, establish a source route that supports the Golden Product and permits the intended access, storage, display, images and analytics. Do not assume licensed data may be copied into the public Git snapshot or processed by an external AI tool. Maintain the existing static catalogue architecture while designing any separately governed market-data path through an approved task.

See [MARKET_DATA_STRATEGY.md](MARKET_DATA_STRATEGY.md) for dated primary-source research, access restrictions, alternatives and proposed quality gates. No provider, subscription, estimation formula, new layout or guaranteed coverage has been approved. This work remains sequenced under Plans 013–015 as appropriate; Plan 010 stays active.

## Chase-adjusted box intelligence — Decision D08

**Confirmed definition of better value:** a box is more attractive when its current price is lower relative to its potential to yield valuable eligible cards. Justin's example compares a higher-priced older release whose major chases have largely surfaced with a cheaper newer box. The intended feature should enable that investigation, not automatically declare old boxes inferior or assume every unobserved card remains available.

A central differentiator is the relationship between current sealed price and the publicly observed finite chase landscape. Personal player/club interest may justify a choice independently of the economic comparison.

Transparent measures may include:

- number of tracked major chase variants
- total tracked finite physical copies
- verified surfaced copies
- probable/reported surfaced copies separately
- copies with no verified public evidence
- surfaced share of supported tracked chase value
- highest-value tracked chase with no verified surfaced record

Use language such as `verified surfaced`, `probable`, `reported`, `no verified public evidence`, or `publicly unaccounted for`.

Disclose the tracked universe. A percentage of copies is not the same as a percentage of chase value, and a selected chase group is not the whole release. Value-weighted measures require dated supported values and explicit handling of variants with missing values; missing is not zero. A variant's price multiplied by its finite total is not automatically a realizable market value or a sealed-box return.

## Future estimated-return and box-value model

Justin wants to compare boxes within a budget by estimated return/value relative to price, accounting for eligible card values and changing finite-chase evidence. This is a genuine analytics goal, not a feature to replace permanently with only raw metrics. It remains gated on supportable data rather than a requirement to invent numerical estimates.

Mature in stages:

1. **Transparent inputs:** sealed price/history, hit frequencies, exact eligible chases, comparable card values, verified surfaced finite counts and coverage.
2. **Evidence-based comparison:** inspectable components and limitations, without labelling a heuristic as expected return.
3. **Modelled estimated-return and value ranges:** only when probabilities, values and uncertainty support an auditable calculation. Define return and fair-value concepts separately rather than equating them.

### Required model distinctions

- Original published odds versus present-day remaining-pool estimates.
- Verified public surfaced counts versus the actual number of opened copies, including unseen private pulls.
- Known finite print runs versus the remaining sealed box population and allocation across configurations/channels.
- Expected gross resale value of the box's cards versus net proceeds after supported selling/shipping costs, the purchase outlay and profit/ROI.
- A whole-box expectation versus a selected-chase component with unmodelled contents.
- Expected value versus typical outcomes, variability and the chance of a loss. An average is not a guaranteed or representative single-box result.

Do not multiply original odds by the unsurfaced percentage. Even in an idealized model, current per-box expected chase yield depends on both remaining eligible hits and remaining boxes. In practice surfaced observations are incomplete and the remaining population/collation may be unknown. A decrease in publicly unaccounted-for chases alone cannot establish whether current odds improved or worsened.

Preserve configuration-specific eligibility and avoid pooling chase supply across boxes merely because both are in the release. Do not assume marketplace box inventory is total unopened supply, or that anonymous resealed/repacked products belong to the original pool. Use exact raw-card comparables for newly pulled cards unless a separately defined model accounts for grading outcomes and costs.

When data cannot support current probabilities, report the evidence and limits. Any scenarios must be explicitly hypothetical, show assumptions/ranges and keep unsupported inputs out of canonical fact fields. A formula, value threshold or model's publication requires a separate tested analytics plan; it must not appear just because a comparison screen exists.

## Manufacturer-ready platform direction

BoxScout should be built so companies such as Topps/Fanatics and Panini can safely participate without controlling BoxScout's independent analysis.

Approved manufacturer-facing direction includes:

- explicit manufacturer/source attribution for official checklists, odds, specifications, images and purchase URLs;
- first-class asset-rights metadata and deterministic withdrawal/removal procedures;
- clear separation in the UI between official manufacturer facts and BoxScout intelligence;
- reviewed manufacturer correction/replacement-asset submissions that enter the normal candidate -> review -> canonical publication workflow;
- official-store destinations represented separately from third-party retailer offers;
- future privacy-safe outbound purchase-intent measurement;
- a supervised structured manufacturer intake/import format for releases, SKUs, checklists, odds and assets;
- future private preview / embargo / scheduled-launch capability only after access control and operational maturity are adequate;
- future aggregate manufacturer analytics only after BoxScout has meaningful traffic;
- preservation of BoxScout editorial/analytical independence regardless of licensing, affiliate or commercial relationships.

The collector remains the primary user. The strategic manufacturer value proposition is a trusted downstream surface where official products are represented accurately while collectors compare and buy sealed product. See `MANUFACTURER_INTEGRATIONS.md` for implementation requirements and staging.

## Current implementation exclusions

Accounts and account-backed checklists/watchlists are approved end-product intent under D09, but not current Plan 010 implementation. Their timing relative to the first real version must be settled through a later scope decision.

The following are not authorized by the current plan:

- user accounts/authentication/cloud collection implementation
- payments or subscription billing
- marketplace or seller inventory owned by BoxScout
- social network
- native iOS app or camera/card scanner
- public API or retailer dashboards
- affiliate implementation or banner-ad-first monetization
- large automated scraping system or microservices
- speculative EV/fair-value claims
- self-service manufacturer portals
- confidential/embargoed manufacturer data handling before the security model supports it

Manufacturer-readiness foundations such as source attribution, rights metadata and withdrawal semantics may be incorporated when they naturally touch active work. Larger portals/analytics/embargo systems require later explicit execution plans.

## Operating budget — Decision D03

Justin accepts an ongoing application budget **under approximately $100/month**, and wants BoxScout eventually to at least pay for itself. The currency was not specified; do not assume USD merely because the first shopping market is the US. Clarify currency and the actual total before approving a paid commitment.

This is an aggregate planning ceiling, not a target to spend fully or authorization to sign up for a service. Account for hosting/database, backups/storage, image delivery, licensed market data, refresh processing and eventual authentication/email together, with development subscriptions considered separately. Routine maintenance hours are still open; the earlier one-hour/week suggestion is not a confirmed commitment.

Cost recovery is an objective, not a revenue forecast. Prefer an inexpensive sustainable release and validate monetization rather than relying on projected earnings to justify immediate spending.

## Long-term strategy — trusted intelligence before revenue

BoxScout aims to become the decision layer immediately before a sealed-card transaction:

```text
discover -> choose a release -> compare boxes -> understand pulls/chases -> compare sellers -> purchase
```

The approved monetization sequence remains:

1. Free purchase intelligence.
2. Affiliate commerce after useful public product coverage.
3. Pro demand validation.
4. BoxScout Pro only after willingness to pay is demonstrated.
5. Retailer / B2B intelligence.
6. API / data licensing.

See `MONETIZATION.md` and ADR 004. Monetization must never influence factual analysis, rankings, surfaced evidence or recommendations. Affiliate commission is never a ranking factor, and card-sale links do not justify pushing singles over boxes under D10.

## Approved long-term data direction

One Release supports multiple sealed Configurations. Configurations share canonical cards but differ in eligible variants; adding a configuration must not duplicate checklist identities.

Future catalogue identity proceeds:

```text
ChecklistEntry -> Variant -> FiniteInstance -> SurfaceObservation -> Evidence
```

Market history and personal account/checklist/watchlist data reference these stable identities through separate boundaries; neither mutates canonical card identity. Preserve privacy and consent when moving beyond current local-only state.

Scale through a supervised Add Product/import workflow:

```text
identify release/configuration
-> source observations
-> normalize candidates
-> validate/review
-> promote canonical records
-> publish approved snapshot
-> verify box-decision surfaces
```

Reuse ingestion patterns rather than one-off pages. Manufacturer data uses the same review architecture, not a privileged alternate source of canonical truth.

## Current recovery roadmap

1. **Plan 010 — Complete Golden Product release catalogue**
2. **Plan 011 — Resolve exact Mega identities, pull-profile relationships and configuration eligibility**
3. **Plan 012 — Box-first frontend and pricing presentation refinement**
4. **Plan 013 — Major chase / finite-instance surfaced tracking**
5. **Plan 014 — Card sales plus sealed-price market intelligence**
6. **Plan 015 — Box comparison and first transparent value model**
7. Scope remaining Golden Product configurations and first-real-version integration/acceptance through bounded follow-on work; finish the D11 release gate before Product #2. Account timing remains a separate pending scope choice.

Manufacturer-readiness targets should be folded into approved plans as dependencies become ready. New end-product decisions must not bypass source feasibility, identity integrity or security.

Plan 010 remains the current implementation authority. The first-real-version target is broader than Plan 010 or the initial Mega slice; neither is a reason to rush all remaining features into the active task.
