# Execution Plan 001 — Bootstrap the First Visible BoxScout

## Status

PLANNED — do not expand beyond this plan without approval.

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
