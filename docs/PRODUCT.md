# BoxScout Product Specification — Phase 1

## Product

BoxScout is a mobile-first soccer-card **sealed-box buying intelligence platform**.

Its primary purpose is to help a collector decide:

> **Which box should I buy, what should I pay, and where should I buy it?**

Cards, checklists, variants, odds, sales and surfaced finite hits are the intelligence inputs that explain whether a sealed box is attractive. BoxScout is not primarily a collection manager or checklist database.

See `PRODUCT_AUDIT_2026-09-15.md` for the audit that established this box-first direction.

## Phase 1 goal

Build a V0 that Justin personally uses when evaluating soccer-card sealed products before spending money.

Phase 1 does not need revenue.

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
10. Compare boxes using transparent metrics.
11. Eventually see a defensible box-value model only after its probability and market assumptions are supportable.

Target Phase 1 catalogue remains deliberately small. Do not add Product #2 until Golden Product #1 works end-to-end well enough that Justin would genuinely use BoxScout before a purchase.

## Golden Product #1

**2026 Panini Prizm FIFA World Cup Soccer**

The Golden Product is the release plus its sealed configurations, with Mega as the first shopper-facing format to make trustworthy end-to-end.

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

Useful intelligence should appear high on the mobile viewport. Static marketing copy should become compact once real data exists.

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

Do not bury purchase information below marketing copy.

### Cards

The visual checklist is an important supporting intelligence surface:

- four columns on mobile
- card image/intentional placeholder
- card number
- player/display name
- search
- filters
- Owned
- Watching
- exact variant drill-down

Its purpose is to let the user inspect what exists and what can be pulled. It must not make BoxScout feel primarily like a collection-management app.

### Chases

Track major eligible cards/variants with:

- exact card/variant identity
- serial total where finite
- box/configuration eligibility
- surfaced status
- evidence/confidence
- supported market value when later available

Never claim that a card with no public evidence is definitely still sealed.

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

Do not claim rigorous expected value in Phase 1.

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

## Chase-adjusted box intelligence

A central long-term differentiator is the relationship between current sealed price and the publicly observed finite chase landscape.

Transparent future measures may include:

- number of tracked major chase variants
- total tracked finite physical copies
- verified surfaced copies
- probable/reported surfaced copies separately
- copies with no verified public evidence
- surfaced share of supported tracked chase value
- highest-value tracked chase with no verified surfaced record

Use language such as `verified surfaced`, `probable`, `reported`, `no verified public evidence`, or `publicly unaccounted for`.

## Future box valuation model

Justin ultimately wants BoxScout to estimate what a sealed box should be worth from its hit structure, eligible card values and changing chase landscape.

This is an approved long-term analytics direction, not a current permission to publish EV or a black-box score.

Mature in stages:

1. **Transparent inputs:** sealed price, hit frequencies, eligible chase structure, supported market values, surfaced finite counts.
2. **Chase-adjusted comparative value:** inspectable formula/components; no opaque AI score.
3. **Modelled fair-value range:** only when probabilities, market values, uncertainty and assumptions are strong enough.

Do not naively multiply original hit odds by the percentage of chase copies not yet surfaced. Opened boxes and surfaced chase copies both alter the remaining opportunity, and the remaining sealed population is generally uncertain. Prefer ranges and explicit uncertainty over fake precision.

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
- preservation of BoxScout editorial independence regardless of licensing, affiliate or commercial relationships.

The collector remains the primary user. The strategic manufacturer value proposition is that BoxScout can become a trusted downstream surface where official products are represented accurately at the point collectors are comparing and buying sealed product.

Implementation requirements and staging are defined in `MANUFACTURER_INTEGRATIONS.md`.

## Out of scope for Phase 1 unless explicitly approved

- user accounts
- authentication
- payments
- subscription billing
- marketplace
- seller inventory owned by BoxScout
- social network
- collection cloud sync
- native iOS app
- camera/card scanner
- public API
- retailer dashboards
- affiliate implementation
- banner-ad-first monetization
- large automated scraping system
- microservices
- speculative EV/fair-value claims
- self-service manufacturer portals
- confidential/embargoed manufacturer data handling before the security model supports it

Manufacturer-readiness foundations such as source attribution, rights metadata and withdrawal semantics are approved direction and may be incorporated when they naturally touch active work. Larger manufacturer portals/analytics/embargo systems require later explicit execution plans.

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

See `MONETIZATION.md` and ADR 004. Monetization must never influence factual analysis, rankings or recommendations. Affiliate commission is never a ranking factor.

## Approved long-term data direction

One Release supports multiple sealed Configurations. Configurations share canonical cards but differ in eligible variants; adding a configuration must not duplicate checklist identities.

Future catalogue identity proceeds:

```text
ChecklistEntry -> Variant -> FiniteInstance -> SurfaceObservation -> Evidence
```

Future market intelligence adds supported card sales/value history and sealed-price history without mixing observations into canonical identity.

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

Reuse ingestion patterns rather than one-off page construction.

Manufacturer-supplied data must use this same review architecture rather than becoming a privileged alternate source of canonical truth.

## Current recovery roadmap

1. **Plan 010 — Complete Golden Product release catalogue**
2. **Plan 011 — Resolve exact Mega identities, pull-profile relationships and configuration eligibility**
3. **Plan 012 — Box-first frontend and pricing presentation refinement**
4. **Plan 013 — Major chase / finite-instance surfaced tracking**
5. **Plan 014 — Card sales plus sealed-price market intelligence**
6. **Plan 015 — Box comparison and first transparent value model**
7. Product #2 only after Golden Product #1 is genuinely useful as a purchase-decision tool.

Manufacturer-readiness requirements in `MANUFACTURER_INTEGRATIONS.md` are approved future implementation targets. They should be folded into active plans when dependencies are ready rather than used to bypass the current Golden Product sequence.

Plan 010 remains the current implementation authority. Later product requirements do not authorize skipping the data foundation.