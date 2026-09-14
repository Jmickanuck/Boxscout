# BoxScout UI Specification — Phase 1

## Design principle

Mobile first.

The most important device is an iPhone-sized screen.

The UI should feel like a serious modern sports/card intelligence product, not a generic admin dashboard and not a novelty AI website.

Do not invent a large design system before real screens exist.

Establish a small number of canonical components, then reuse them.

## Product navigation

Initial direction:

```text
Products
Compare
```

Inside a product:

```text
Overview
Cards
Chases
```

Keep navigation compact on mobile.

## Products page

Purpose:
help the user quickly choose a sealed product.

Each product card should eventually support:
- product image where usage is allowed
- product name
- configuration
- current sealed price
- short decision-relevant summary

Do not overload the card with every statistic.

## Cards page

This is a core BoxScout surface.

Requirements:
- four cards across on mobile
- vertical scrolling
- image
- card number
- player name
- search
- filter controls
- Owned state
- Watching state
- future card-body detail navigation (not implemented by tile refinement)

Initial filters:
- All
- Base
- Inserts
- Autos

Later filters may expand.

## Initial image behavior

Do not wait for full image coverage.

First functional target:
- complete structured checklist records
- approximately 24–40 genuine usable images
- honest placeholders for missing imagery

Placeholders must not look like a failed image request.

## Canonical visual-checklist tile

The CardBrowser tile is the canonical Phase 1 component. Future agents must extend it rather than redesign it during checklist expansion.

- Dense image-led gallery, four columns on mobile, with narrow horizontal gaps and no surrounding information panels.
- Card image or intentional placeholder dominates the tile. Immediately beneath it, show only card number and player name (for example, #10 Lionel Messi), wrapping naturally for long names.
- No country/team labels, verification badges, per-card status text, redundant metadata or full-width controls beneath the image.
- Owned: checkmark icon overlaid top-left; subtle inactive appearance and solid green/white active appearance.
- Watching: star icon overlaid top-right; outlined inactive star and filled gold active appearance.
- Compact 24px visible icons sit inside larger hit areas: 44px high, up to 44px wide, limited to half the image width so the two controls never overlap at four-column mobile sizes. At the narrow tested width this is approximately 40px wide. Native buttons expose descriptive labels, aria-pressed, keyboard activation and visible focus.
- Stable toggle labels such as “Mark Lionel Messi as owned” and “Watch Lionel Messi” combine with aria-pressed to communicate state. Owned and Watching are independent and may both be active.
- Preserve stable IDs and boxscout:collection:v1 persistence. Do not tie collection state to tile index or search result order.

Overlay buttons are siblings of the image/body, not children of a clickable detail link; their click events do not bubble into a future body action. A future detail feature should make only the image/body its own link. No card-detail route or interaction is added by this refinement.

## Card detail — Phase 1 direction

Show:
- image
- player
- card number
- subset
- card/variant identity
- serial information where relevant
- Owned
- Watching
- evidence/market information when available

Unknown data should be shown honestly or omitted.

## Product overview

Show decision-relevant data first:
- current sealed price
- box configuration
- content/pull rules
- important configuration-exclusive parallels
- major chases
- provenance/qualification where needed

Do not bury the key purchase information below marketing copy.

## Compare

Use transparent metrics only.

Avoid scoring systems that imply more certainty than the data supports.

## Performance

For large visual checklists:
- lazy-load images
- use responsive image sizes
- avoid sending full evidence history into each grid tile
- load detailed evidence only when needed

Only add virtualization/pagination if real performance testing shows it is needed.

## Visual consistency rule

Once Justin approves a Product page, Cards page, and Card tile, treat those as canonical references.

Future agents should extend the established design rather than redesigning the product from scratch.
