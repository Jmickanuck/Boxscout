# Execution Plan 001 — Bootstrap the First Visible BoxScout

## Status

COMPLETE — Plan 001 implemented and verified on 2026-09-14. Further scope requires a new approved task.

## Goal

Create the first real, mobile-first BoxScout vertical slice.

At completion, Justin should be able to run the app and:

1. see a Products page
2. open the Golden Product
3. open its Cards view
4. see a four-column mobile card grid
5. search the fixture checklist
6. toggle Owned
7. toggle Watching
8. refresh and retain Owned/Watching state

No database or authentication yet.

## Technical scope

Initialize:
- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS

Use typed local fixture data.

Do not introduce Supabase.

## Expected structure

Create only what is useful.

Likely areas:

```text
src/app/
src/components/
src/domain/
src/repositories/
src/data/fixtures/
src/types/
docs/
tests/
```

Do not create dozens of empty abstractions.

## Pages

### Products

Simple mobile-first product list.

Initially one product:
2026 Panini Prizm FIFA World Cup Mega.

### Product

Basic overview with enough structure to prove routing.

Do not invent unsupported statistics.

### Cards

Four-column mobile grid.

Each tile:
- image or honest placeholder
- card number
- player name
- separate Owned control
- separate Watching control

Tap card body can open a simple detail route/modal if doing so does not materially enlarge the bootstrap task. Otherwise defer detail behavior to the next task.

## Data

Use a small typed Golden Product fixture.

Factual fixture rows must come from sourced Golden Product data.

If full verified data is not ready, use only verified rows and honest placeholders rather than invented players/cards.

## Images

The bootstrap must support image metadata and missing-image behavior.

It does not require 500 images.

Target:
enough real/approved images to test several rows if legally/technically available.

If approved images are not yet ready, placeholders are acceptable.

## Local collection state

Create a repository/service abstraction for personal state.

Do not scatter localStorage calls throughout React components.

Behavior:
- Owned and Watching are independent
- state persists after refresh
- state is keyed by stable card ID
- canonical fixture data is never mutated

## Search

Phase 1 bootstrap:
case-insensitive player/card search sufficient.

Do not install a search engine/library.

## Acceptance criteria

### Functional
- app runs locally
- Products page loads
- Golden Product opens
- Cards page loads
- mobile grid renders four columns at target iPhone width
- search filters displayed cards
- Owned toggles independently
- Watching toggles independently
- both states can be true
- refresh preserves state
- missing images render intentional placeholders
- no console-breaking errors

### Architecture
- typed fixture data is not embedded directly in UI components
- collection-state persistence is abstracted
- no factual data is silently invented
- no Supabase/auth
- no unnecessary dependencies

### Verification
Create/support and run as appropriate:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

A minimal automated test should cover collection-state/domain behavior if practical within the bootstrap.

## Manual mobile review

Before task completion:
- run the application
- inspect at an iPhone-sized viewport
- verify four-column layout
- verify no horizontal overflow
- verify controls are usable
- verify search
- verify persistence
- show Justin the result

## Completion

Commit as one or a small number of coherent commits.

Suggested final commit message:

`feat: bootstrap BoxScout mobile golden-product slice`

Then report:
- what works
- how Justin can run/view it
- checks passed
- known limitations
- recommended next bounded task

## Approved implementation amendment — 2026-09-14

Status: COMPLETE. Justin approved Plan 001 with a documentation-only baseline commit first (45197ff), followed by this bounded bootstrap.

- Preserve all existing documentation and use Git for Windows explicitly; do not alter PATH.
- Manually initialize the standard Next.js/React/TypeScript/App Router/Tailwind files in place.
- Use 24 base checklist records (#1–24), checked against TCDB and Checklist Insider on 2026-09-14. Preserve per-record provenance and limit VERIFIED to checklist identity, not configuration eligibility.
- Keep Mastermind SKU/UPC, NPP mapping, price and unsupported contents unknown. Use image placeholders with separate match/rights metadata.
- Build Products, Overview and Cards only. Defer optional detail behavior, filters beyond search, Compare and Chases.
- Data flow: server routes -> catalogue repository -> typed fixtures; interactive Cards -> domain search/collection rules -> browser collection repository. Never mutate canonical fixtures.
- Expected files: package/configuration files, src/app routes/styles, src/components, src/types, src/domain, src/repositories, src/data/fixtures, focused tests, README and this plan. No empty future modules.
- Verify lint, typecheck, tests, production build, mobile browser navigation/search/toggles/reload, placeholders, overflow and console errors; review diff before coherent commits.

## Completion and verification — 2026-09-14

- Built Products -> Golden Product overview -> Cards, with 24 cross-checked base identities and per-record source metadata.
- Four-column mobile checklist; player/card-number search; separate Owned/Watching toggles; versioned browser-local state. Both flags can be true. Storage errors are surfaced without silently overwriting saved data.
- All images are intentional placeholders; no third-party image rights assumed. Exact Mastermind configuration, NPP mapping, price and contents remain unknown. UI distinguishes release identities from unverified configuration eligibility.
- npm run lint: PASS, zero warnings after fixing the PostCSS configuration export.
- npm run typecheck: PASS.
- npm test: PASS, 8 tests; no skipped or disabled tests. Covers independent flags, persistence, immutable fixtures, invalid storage, write failures, search, provenance/unknowns, image rights/matching, and unknown catalogue entities.
- npm run build: PASS, Next.js 16.3.5 production build.
- npm install audit: 0 reported vulnerabilities. npm metadata initially used a stale cache; a fresh task-local cache resolved it. No system PATH changes.
- Browser review used the production server on 127.0.0.1:3000. Products -> overview -> Cards passed. Case-insensitive Messi search and #24 search passed; no-results and clearing search passed.
- Owned-only, both true, and Watching-only states verified. Reload restored both true and Watching-only correctly after browser hydration. Test flags were returned to false through the UI.
- At 390x844, grid columns were 80.5px each with 44px-high controls. At 375x812, columns were 76.75px each. No horizontal overflow. All 24 placeholders present.
- Desktop review at 1280x900 passed. Browser warning/error log was empty. This was viewport testing on this PC, not physical iPhone/Safari testing.
- Reviewed source and staged diff; original documentation preserved except this execution plan's status/amendments/results.

Known limits: sample checklist only; configuration/SKU and pull eligibility unverified; no price observations or approved images; browser-local state only; optional card details and all excluded surfaces deferred. Near-simultaneous writes from multiple tabs are not transactional.

Recommended next bounded task: verify the exact Mastermind Mega SKU/UPC and source its configuration/content claims and a dated sealed-price observation. Seek Justin's feedback on this visible baseline before substantial visual changes.
