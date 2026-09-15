# BoxScout Product Audit — 2026-09-15

## Purpose

This document records Justin's mobile audit of the live BoxScout site and the resulting product decisions. It is a requirements record, not authorization to skip the active execution plan. Governing requirements are also promoted into `PRODUCT.md`, `UI_SPEC.md`, and `PHASE_1_STATUS.md` so future agents do not need this audit history to understand the product.

## Primary product decision

**BoxScout is a sealed-box buying intelligence application.**

The main user question is not "what cards are in this set?" It is:

> **Which box should I buy, what should I pay, and where should I buy it?**

Card/checklist data is essential because it explains the contents, odds, chase quality and remaining upside of a sealed box. It is a supporting intelligence layer, not the primary product identity.

## Audit finding 1 — Homepage should be an intelligence dashboard

The current homepage is visually clean but behaves like a static landing page. The finished product should feel alive and decision-oriented.

Desired mobile dashboard modules, when supported by real data:

- prominent box/set search
- Featured Boxes / Featured Products
- new or notable releases
- latest major verified pull / surfaced finite chase
- latest major verified card sale
- meaningful sealed-box price moves or price drops
- boxes with interesting remaining chase landscapes
- recent BoxScout data updates
- later, personal Watching / saved-box activity

The large marketing hero should become more compact so useful intelligence appears high on the first viewport. Static marketing copy should not dominate the product once real intelligence is available.

## Audit finding 2 — Correct product hierarchy and terminology

The current Mega presentation risks confusing box versions with card "subsets." In BoxScout terminology, **subset** is reserved for card-checklist families such as Aces, Signatures or International Ink.

Use this hierarchy:

```text
Release / Set
  -> Box Format
      -> Box Version / Configuration
          -> Retailer Listings / Offers

Release
  -> Card Subsets
      -> Checklist Entries
          -> Variants
```

Examples:

- Release / Set: `2026 Panini Prizm FIFA World Cup`
- Box Format: `Mega`, `Hobby`, `Blaster`, `Choice`, `FOTL`
- Box Version / Configuration: `NPP Mega`, `Target Mega`, `DSG Mega`, `Hobby Mega`
- Retailer Listing: an exact seller offer/SKU/UPC/price observation
- Card Subset: `Aces`, `Signatures`, `National Heroes`

### Pull Profile

BoxScout may also maintain an internal **Pull Profile** concept when multiple exact SKUs/configurations are proven to share materially the same pull pool and hit structure. This is a grouping/analytics concept, not permission to merge products based only on similar pack counts or retailer language.

Equivalent pull profiles require evidence. Different UPCs do not automatically mean different contents, and identical pack counts do not prove identical contents.

## Audit finding 3 — Set page should help choose a box

Opening a release should answer "how can I buy/open this set?"

The set page should prioritize box formats and decision-relevant summary information rather than catalogue browsing.

A box-format card should eventually support, where evidence exists:

- typical / average market price
- lowest credible current offer
- packs and cards per pack
- important guarantees or per-box averages
- number of known box versions/configurations
- important configuration-exclusive parallels
- headline chase information
- surfaced status of tracked major finite chases
- concise reason to choose the format

The card checklist remains accessible as a drill-down, not the dominant set-page purpose.

## Audit finding 4 — Box format page should compare its versions

A Mega page should compare the actual Mega versions/configurations rather than listing cryptic retailer/parallel names without context.

For each version, show when supported:

- exact version/configuration name
- identifying channel/retailer context
- average sealed market price
- cheapest credible current offer
- box contents / hit structure
- exclusive or characteristic parallels
- autograph / numbered / case-hit frequencies where defensible
- top eligible chases
- tracked finite chase surfaced counts
- evidence confidence / completeness state

This is the natural place to explain NPP vs Target vs DSG vs Hobby Mega differences.

## Audit finding 5 — Box page is the core commercial surface

A specific box/configuration page should answer, in order:

1. What box is this exactly?
2. What does it cost now?
3. Where can I buy it cheapest from a credible seller?
4. What do I get in the box?
5. What are my published/defensible hit frequencies?
6. What are the best cards eligible in this exact box?
7. Which major finite hits have publicly surfaced?
8. What meaningful upside is publicly unaccounted for?
9. How does this box compare with alternatives?

Retailer pricing should distinguish asking/listing prices from verified completed sales. Future delivered-price comparison may normalize currency, shipping and known costs without inventing missing tax/shipping data.

## Audit finding 6 — Price intelligence is a core data domain

BoxScout should evolve beyond a single recorded retailer price into a sealed-product market view.

Future metrics may include:

- average/median credible active listing price
- cheapest credible active listing
- recent verified sealed sale price
- historical sealed price
- currency-normalized values
- seller/source and observation timestamp
- stock/availability only when actually supported

Do not let an absurd asking price distort a market estimate. Active listings and completed sales remain distinct observation types.

## Audit finding 7 — Chase depletion belongs next to box price

One of BoxScout's central differentiators is the relationship between sealed price and the publicly observed finite chase landscape.

Future box intelligence should show transparent measures such as:

- tracked major chase variants
- total tracked finite physical copies
- verified surfaced copies
- probable/reported surfaced copies separately
- copies with no verified public evidence
- surfaced share of tracked chase value, where market values are supported
- best/highest-value tracked chase with no verified surfaced record

Never state that an unobserved card is definitely still sealed. Use language such as `no verified public evidence` or `publicly unaccounted for`.

## Audit finding 8 — Future box valuation model

Justin ultimately wants BoxScout to estimate what a sealed box should be worth based on its pull structure, market values and changing chase landscape.

This is a long-term analytics goal, not a current Phase 1 claim.

The model should mature in stages:

### Stage 1 — transparent inputs

- current sealed price
- published/defensible hit frequencies
- autograph / numbered-card frequency
- eligible chase structure
- supported card market values
- finite surfaced counts

### Stage 2 — chase-adjusted comparative value

A transparent comparative model may combine potential reward, hit probability, chase availability and box price. Every component must be inspectable; avoid opaque AI scores.

### Stage 3 — modelled fair-value range

Only after sufficient data quality, model the distribution of configuration-eligible outcomes and uncertainty. The model should account for the fact that surfaced chase copies and opened boxes both change the remaining opportunity. Simply multiplying original odds by the unsurfaced percentage is statistically unsound when the remaining sealed population is unknown.

Prefer a value range and uncertainty explanation over fake precision. Do not label the model rigorous expected value until the necessary probability and market assumptions can actually support that term.

## Cards remain important

The visual checklist, card details, images, variants, Owned/Watching and card market data remain valuable. They serve the sealed-box decision engine by answering what can be hit and how valuable/rare those outcomes are.

The frontend should not drift into presenting BoxScout primarily as a collection-management or checklist application.

## Roadmap implication

The recovery roadmap should preserve the data-first work but become explicitly box-first in its outcome:

1. **Plan 010 — Complete Golden Product release catalogue**
2. **Plan 011 — Resolve exact Mega identities, versions/pull profiles and configuration eligibility**
3. **Plan 012 — Box-first frontend and pricing presentation refinement**
4. **Plan 013 — Major chase / finite-instance surfaced tracking**
5. **Plan 014 — Card sales plus sealed-price market intelligence**
6. **Plan 015 — Box comparison and first transparent value model**
7. Product #2 only after the Golden Product works as a real purchase-decision tool.

Plan 010 remains the active implementation plan. This audit does not authorize jumping to later UI/analytics work before the underlying data supports it.
