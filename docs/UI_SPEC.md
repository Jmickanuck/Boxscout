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
- approved real images when rights and exact matches are established; zero is acceptable for the foundation
- honest placeholders for missing imagery

Placeholders must not look like a failed image request.

## Canonical visual-checklist tile

The CardBrowser tile is the canonical Phase 1 component. Future agents must extend it rather than redesign it during checklist expansion.

- Dense image-led gallery, four columns on mobile, with narrow horizontal gaps and no surrounding information panels.
- Card image or intentional placeholder dominates the tile. Immediately beneath it, show only card number and player name (for example, #10 Lionel Messi), wrapping naturally for long names.
- No country/team labels, verification badges, per-card status text, redundant metadata or full-width controls beneath the image.
- Owned: checkmark icon overlaid top-left; subtle inactive appearance and solid green active fill with a contrasting checkmark.
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


## Canonical theme system

Dark is BoxScout's primary appearance and the first-visit default, independent of system theme. Light is a polished alternative selected through the compact header control on every route. The control shows the current mode and exposes an accessible label naming the current mode and the switch action; keyboard focus remains visible.

All component colors use shared semantic CSS variables in globals.css. Dark and Light use the same hierarchy, spacing, four-column grid and interaction structure. Text, forms, notices, provenance, placeholders and active/inactive collection controls must remain readable in both palettes. Owned uses a filled green treatment with a contrasting checkmark; Watching remains filled gold with a star. Keep 44px-high control targets and visible focus.

Theme preference is separate from catalogue facts and boxscout:collection:v1. A reusable ThemePreferenceRepository validates and persists dark/light under boxscout:theme:v1. Missing, invalid or unreadable storage defaults to Dark; storage failure must not crash the app or claim persistence. The chosen mode still works for the current page when saving fails, with a visible status message. Other tabs synchronize via the storage event. Future account-backed preferences belong behind this boundary, not in components or catalogue data.

Server HTML and default CSS are Dark. A small synchronous head script applies validated saved preference before body paint, using the repository's parser/key. No system-theme fallback, color transition, external theme dependency or hydration-time palette switch. Only the intentional root theme attribute hydration difference is suppressed. With JavaScript disabled, Dark remains readable; the toggle requires JavaScript.


## Image asset foundation

Preserve the canonical tile and both themes. The repository supplies only approved exact base-front images; all others remain intentional placeholders. Images use object-fit:contain, fixed aspect ratio, responsive sizes, explicit lazy loading and async decoding. The grid never uses source/original URLs. Error fallback is scoped to the failed asset URL, so a later replacement can load. Number/name and Owned/Watching overlays are unchanged.

Required public credits appear below the gallery without adding tile metadata. Before accepting a license, verify it permits this placement. Test actual bright and dark imagery against overlay/focus contrast when cleared imagery becomes available. No real-image visual coverage is claimed when zero public assets qualify.

## Plan 005 browsing and future variant details

Default remains the 500-card Base gallery. A compact expandable filter area adds All/Base/Inserts/Autographs/Variations, edition, numbered/serial ceiling, country/team, subset, configuration eligibility and independent Owned/Watching. Text searches player, number, country, subset and parallel name. Filters intersect. All means the loaded pilot coverage, not a claim of full release coverage. Parallel/numbered/autograph/ownership/eligibility criteria expose exact variants; a parallel-name search also exposes exact variants.

Keep four mobile columns, image-dominant tiles, the same overlay controls and only # + name captions. Exact results group under subset/parallel/serial headings and use descriptive accessible toggle labels. Show exact-result counts and pilot coverage. Unknown eligibility is excluded from a selected-configuration view with an explanation; probable matches require opt-in. Browsing the release does not assert pullability from the current box. Existing marks are Base/default ownership, never unspecified or copied across parallels.

Every user-facing variant must eventually have a dedicated detail page. Its future content includes exact imagery, player/card/checklist identity, subset/type, parallel and serial total, eligible configurations, recent sightings/listings, confirmed sales with graded/raw context, supported market-value estimates/history, finite surfaced counts and known serial numbers, evidence/provenance, interesting factual context, Owned/Watching and eventual personal collection information. Unknown information remains unknown. No detail route or market feature is implemented now; the image/body remains structurally separate from overlay controls.

A future /99 detail may report 18 verified surfaced copies without claiming the other 81 are still sealed. A verified genuine surfaced 1/1 can later be classified fully surfaced/unavailable from unopened product, subject to correct identity and evidence review. No surfaced counters or depletion calculations are present now.

## Set to box navigation — Plan 007

Homepage release cards preserve the established appearance and open /sets/[releaseId]. The set page lists known published configuration formats; only an existing supported product has an Explore link. Other formats say Details coming soon and have no dead links. Probable formats and the test Mega's probable NPP association stay visibly qualified. This list does not claim complete format coverage or shared variant eligibility.

Navigation is Home → set → box → Overview/Cards. Existing product and Cards URLs remain valid; their back link returns to all boxes in the set. Release cards are deduplicated by existing release ID. No catalogue identities, publication, backend, filters or collection storage change.

## Retailer-focused box overview — Plan 008

The box Overview leads with Where to buy: reviewed matching-product retailer links, recorded prices only where available, and a short instruction to check retailers for current price/stock/delivery. It does not imply in-stock availability or live prices. Packaging uses three compact totals (packs, cards per pack, total cards), followed by average contents and a short qualification where necessary.

Remove retailer-identity tables, SKU/UPC, repeated source/date labels, public evidence/history disclosures and the overview source footer. These facts remain in the canonical data and operator records. Links serve shopping; no factual data or provenance is deleted. The Cards source section is unchanged.
