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
- card tap opens detail

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

## Card interaction

Default recommendation:

- tapping the card body opens details
- Owned and Watching use separate clear controls
- Owned and Watching can both be true

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
