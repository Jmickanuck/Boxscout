# BoxScout Box-First UI Direction

Last updated: 2026-09-15

## Purpose

This document translates the 2026-09-15 live-site audit into future UI requirements. It supplements `UI_SPEC.md`. It does **not** authorize skipping the current active execution plan; implementation belongs primarily to Plan 012 after release completeness and Mega eligibility are trustworthy enough to support the interface.

## Primary UX rule

The UI should optimize for this decision:

> **Which sealed box should I buy, what should I pay, and where should I buy it?**

Card/checklist browsing is supporting intelligence. The application should not feel primarily like a card checklist or collection manager.

## Homepage — intelligence dashboard

The mature mobile homepage should feel active and useful immediately.

### Priority modules

When backed by real data, prefer:

1. compact search / discovery entry point
2. Featured Boxes / Featured Products
3. new or notable releases
4. latest major verified surfaced pull
5. latest major verified card sale
6. meaningful sealed-product price movement / price drops
7. boxes with notable remaining chase landscapes
8. recent BoxScout data updates
9. later: personal watched/saved products

### Layout direction

- Reduce oversized static hero space once live intelligence exists.
- Put useful data high enough that at least one decision-oriented module is visible in the first mobile viewport.
- Preserve the current BoxScout visual identity unless a later approved design task changes it.
- Avoid generic admin-dashboard styling.

## Release / set page

Purpose: show the sealed ways a collector can buy/open the release.

Use **Box Format** labels such as Mega, Hobby, Blaster, Choice and FOTL.

A format card may eventually show:

- average / typical sealed market price
- cheapest credible current offer
- pack/card counts
- important per-box averages or guarantees
- number of known versions/configurations
- important exclusive parallels
- headline chase/surfaced information
- concise buying rationale

Do not call box versions/configurations `subsets`. `Subset` is reserved for card checklist families.

## Box format page

Purpose: explain and compare materially different versions/configurations of the same format.

Example Mega versions may include NPP, Target, DSG and Hobby Mega where evidence supports them.

Each configuration card should eventually support:

- exact configuration/version name
- channel/retailer context
- average sealed market price
- cheapest credible current offer
- packs/cards
- defensible hit structure
- exclusive/characteristic parallels
- autograph/numbered/case-hit frequencies where supported
- top eligible chases
- finite surfaced status
- coverage/confidence state

If several exact SKUs are proven to share the same pull structure, the interface may group them through an internal Pull Profile while retaining exact canonical identities.

## Specific box/configuration page

This is the core purchase-decision surface.

### Above-the-fold priority

As data becomes available, prioritize:

- exact box/version identity
- current/typical sealed price
- cheapest credible buying option
- pack/card configuration
- headline hit rule/frequency
- strongest eligible chase / notable exclusives
- concise tracked chase surfaced indicator

### Primary sections

1. **Where to buy**
   - credible retailer/source
   - observed listing price
   - currency
   - availability only when supported
   - observation timestamp
   - later: normalized delivered-price comparison where data permits

2. **Inside the box**
   - packs
   - cards per pack
   - total cards
   - source-qualified guarantees/averages
   - important exclusives

3. **Chase landscape**
   - top eligible chases
   - verified surfaced finite copies
   - probable/reported separate from verified
   - no-public-evidence state rather than `still live`

4. **Eligible cards**
   - drill into visual checklist filtered by exact configuration eligibility
   - never infer pullability from release membership alone

5. **Price/history/value intelligence**
   - only once supported by later plans

## Sealed-price presentation

The UI must distinguish:

- active listing / asking price
- verified completed sealed sale
- market summary derived from multiple observations

Future box cards may show:

- `Typical market: C$___`
- `Lowest credible offer: C$___`
- `Recent sealed sale: C$___`

Do not represent one old retailer observation as a universal live market price.

## Chase-depletion presentation

Prefer transparent language such as:

- `21 verified surfaced`
- `4 probable/reported`
- `49 with no verified public evidence`

Avoid:

- `49 still in boxes`
- `guaranteed live`
- unsupported remaining probability claims

If supported market values exist later, BoxScout may report a surfaced share of tracked chase value with the methodology visible.

## Future valuation presentation

Do not publish a black-box `BoxScout Score` or fair value merely because enough UI exists to display one.

When data supports it, evolve from:

1. transparent raw metrics
2. transparent chase-adjusted comparison
3. modelled fair-value range with uncertainty and visible assumptions

The user should be able to understand why a box is rated attractive or unattractive.

## Card browsing

Cards remain a rich supporting surface.

The existing four-column mobile visual checklist can remain canonical. Improvements should help users answer:

- what cards exist in the release?
- what exact variants exist?
- which of those are eligible in this box?
- which important finite copies have surfaced?

Owned/Watching remains useful but should not dominate BoxScout's product identity.

## Terminology

Use consistently:

- **Release / Set** — the overall card release
- **Box Format** — Mega, Hobby, Blaster, Choice, FOTL, etc.
- **Box Version / Configuration** — NPP Mega, Target Mega, DSG Mega, Hobby Mega, etc.
- **Pull Profile** — internal/evidence-backed grouping of configurations with materially equivalent pull structures
- **Retailer Listing / Offer** — a seller-specific SKU/UPC/price observation
- **Card Subset** — Aces, Signatures, International Ink, etc.
- **Checklist Entry** — one card identity in a subset
- **Variant** — one exact parallel/version of a checklist entry

## Implementation gate

Plan 010 and Plan 011 must establish enough trustworthy release and box eligibility data before Plan 012 implements this UI direction. Placeholder or partial screens must never imply complete intelligence when the underlying coverage is incomplete.
