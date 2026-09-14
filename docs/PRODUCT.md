# BoxScout Product Specification — Phase 1

## Product

BoxScout is a mobile-first soccer-card sealed-product intelligence platform.

It is not primarily a collection manager. Its core purpose is to help a collector understand and compare sealed soccer-card products before spending money.

## Phase 1 goal

Build a V0 that Justin personally uses when evaluating soccer-card sealed products.

Phase 1 does not need revenue.

## Phase 1 success

The V0 should allow a user to:

1. Browse supported soccer sealed products.
2. Open a product.
3. See current sealed price and configuration.
4. Understand what is actually eligible to be pulled from that exact configuration.
5. Browse the set visually in a four-column mobile grid.
6. Search/filter the checklist.
7. Mark cards Owned.
8. Mark cards Watching.
9. See major chases.
10. See finite-card surfaced status with evidence/confidence.
11. Compare a small number of boxes using transparent metrics.

Target Phase 1 catalogue: approximately five products.

Do not add Product #2 until Golden Product #1 works end-to-end well enough that Justin would genuinely use it before a purchase.

## Golden Product #1

2026 Panini Prizm FIFA World Cup Soccer — Mega Box.

Retail reference initially supplied:
Mastermind Toys product listing.

This product is deliberately complex and should force the system to model:

- release vs configuration/SKU
- configuration-exclusive parallels
- base checklist
- inserts
- autographs
- finite numbered cards
- visual checklist
- chase tracking
- evidence/provenance

## Core user surfaces

### Products
Browse supported sealed products.

### Product Overview
Show:
- product identity
- configuration identity/status
- current sealed price
- box configuration
- pull/content rules
- configuration-exclusive information
- major chases

### Cards
Visual checklist:
- four columns on mobile
- card image
- card number
- player name
- search
- filters
- Owned
- Watching
- tap to open detail

### Chases
Tracked major cards:
- card/variant identity
- serial total where finite
- surfaced status
- evidence/confidence

### Compare
Compare products using only defensible metrics.

Examples:
- current sealed price
- numbered-card frequency where known
- autograph frequency where known
- tracked major chases
- surfaced percentage
- configuration-exclusive chase information

Do not claim rigorous expected value in Phase 1.

## Out of scope for Phase 1

Unless explicitly approved, do not add:

- user accounts
- authentication
- payments
- subscription billing
- marketplace
- seller inventory
- social network
- collection cloud sync
- native iOS app
- camera/card scanner
- public API
- retailer dashboards
- affiliate implementation
- banner advertising
- large automated scraping system
- microservices
- speculative EV scores

## Long-term context only

Potential future monetization:
1. affiliate commerce
2. BoxScout Pro
3. retailer/hobby-shop tools
4. API/data licensing
5. carefully labeled sponsorships

Do not let future monetization distort Phase 1 product decisions.
