# Golden Product #1 — Working Specification

## Product

2026 Panini Prizm FIFA World Cup Soccer — Mega Box

Initial retailer reference supplied by Justin:
Mastermind Toys.

## Purpose

This is the first product used to validate the complete BoxScout vertical slice.

Do not add additional products simply to make the catalogue look bigger.

## Important modelling lesson

“Mega Box” is not sufficient identity.

The release has multiple configurations/SKUs.

BoxScout must model:

```text
Release
→ specific configuration/SKU
→ eligible parallel/variant families
```

## Working facts from current research

Treat these as working facts with provenance, not permanent truth without sources:

- 7 cards per pack
- 6 packs per box
- 42 cards total
- matching-UPC retailer descriptions use “per box, on average”; final physical packaging has not been independently inspected
- multiple Mega configurations exist
- the Mastermind Mega appears likely to correspond to the NPP Mega configuration, but exact SKU/UPC verification should be completed before setting canonical VERIFIED status
- the base checklist contains 500 base cards
- total collectible content is larger than 500 because inserts, autographs, variations and parallels exist

## Current data work required

Before calling the Golden Product dataset complete:

1. Verify exact Mastermind configuration/SKU.
2. Preserve source URLs and checked dates.
3. Build complete base checklist.
4. Model insert/subset structure.
5. Model relevant variant/parallel structure.
6. Map configuration eligibility.
7. Add rights-cleared imagery through the reusable pipeline; coverage is conditional on permission, never a quota.
8. Identify manually curated major chases.
9. Add sealed-price observations.
10. Preserve uncertainty where evidence conflicts.

## Image policy

Do not blindly copy images from Google, eBay, marketplaces or checklist sites.

For each image, track:
- exact card match confidence
- source
- usage/publication status

A missing image is acceptable.

## Definition of Golden Product completion

Golden Product #1 is successful when Justin can use the real product page on his phone to:

- understand the box
- browse its checklist visually
- search/filter cards
- mark Owned/Watching
- inspect major chases
- make a more informed purchase decision


## Plan 002 reviewed state — 2026-09-14

- Exact Canadian listing: [Mastermind Toys](https://www.mastermindtoys.com/products/2026-panini-soccer-prizm-world-cup-mega-box), SKU 256877, retailer-reported UPC 746134202520, variant 41821202317445. UPC-A check digit passes, which is syntax validation only.
- Release authority: [Panini official release article](https://blog.paniniamerica.net/panini-prizm-fifa-world-cup-2026-hits-the-net/). It does not identify this Mega UPC; other configuration counts are not borrowed.
- NPP mapping is PROBABLE, supported by [Collectors Emporium's same-UPC NPP description](https://collectorsemporium.com/en-ca/products/2026-panini-prizm-fifa-world-cup-trading-cards-mega-box), [SCHEELS matching-UPC contents](https://www.scheels.com/p/18467-2-20253-20mo20/74613420252), and the [Panini NPP sell sheet hosted by GTS, page 5](https://gogts.net/wp-content/uploads/2026/06/2026-Panini-Prizm-World-Cup-Soccer-Cards-Sell-Sheet-Retail.pdf). No authoritative UPC-to-NPP bridge was established in the bounded review.
- Six packs × seven cards = 42 is qualified as probable applicability, with source-specific specifications retained. The five retailer average claims are separate from sell-sheet guarantee claims; exact-box guarantees remain unresolved. SCHEELS' eight Prizms includes six Disco, never eight plus six.
- Two genuine Mastermind checks recorded CAD $119.99 for one box at 2026-09-14T20:20:41.132Z and 2026-09-14T20:30:25.573Z. Both are retained. Conflicting stock signals mean availability UNKNOWN; shipping is separate and tax treatment unknown. These are dated listing observations.
- The existing 24 base cards, placeholders and independent local flags are unchanged. Full checklist, variant eligibility, images and other Golden Product completion items above remain deferred beyond this plan.


## Plan 003 reviewed base coverage — 2026-09-14

The base sample is replaced by 500 verified release-level base identities (#1–500). All 24 prior stable IDs are unchanged. Distributor GTS and Checklist Insider supply complete factual extracts; TCDB supplies targeted discrepancy corroboration. Five name differences and one equivalent country-label difference are explicitly reviewed in `data/imports/golden-product-base/discrepancies.json`. No unresolved substantive differences remain in those imported observations. Future source corrections must be reviewed rather than silently applied.

The lightweight, offline replayable importer validates coverage, base membership, provenance, numeric order, source hashes and legacy identity compatibility. The canonical mobile tile, search and browser-local collection v1 remain unchanged. Placeholders remain intentional. This completes base coverage only; Mega mapping remains PROBABLE, individual-card eligibility UNKNOWN, and images/variants/chases and other completion goals above remain out of scope.


## Plan 004 image foundation

One Panini promotional image URL was screened as a discovery reference; no exact base identity or public reuse permission was established. No third-party image binary was retained. Zero card-target candidates were promoted and zero public card images are approved. All 500 cards retain placeholders; source coverage is not fabricated. See data/imports/golden-product-images/discovery.json. The reusable approval/generation/rendering path is exercised with synthetic test pixels in temporary directories, never presented as real cards. Configuration mapping and eligibility remain unchanged.
