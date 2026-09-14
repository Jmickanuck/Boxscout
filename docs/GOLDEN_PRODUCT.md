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
- product packaging uses “per box, on average” wording for expected contents
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
7. Add first 24–40 usable card image records.
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
