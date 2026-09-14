# BoxScout Architecture

## Architectural principle

Start as a **modular monolith**.

Do not build a throwaway frontend, but also do not build microservices before there is real need.

Target evolution:

```text
Browser / Phone
      |
      v
Next.js
      |
      v
Application / Domain Layer
      |
      v
Repository / Data Access Layer
      |
      v
Typed Fixtures initially
      |
      v
PostgreSQL / Supabase later
```

Future ingestion:

```text
External sources
   ↓
Raw observations
   ↓
Normalized candidates
   ↓
Validation / review
   ↓
Canonical database
   ↓
BoxScout application
```

## Frontend

Preferred:
- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS
- server components by default
- client components only when required

Mobile first.

Design at iPhone width first. Desktop is an enhancement.

Avoid a large UI framework unless there is a compelling reason.

## Suggested routes

```text
/
/products/[productSlug]
/products/[productSlug]/cards
/products/[productSlug]/chases
/compare
```

Do not create future routes until needed.

## Suggested source layout

```text
src/
  app/
  components/
    cards/
    products/
    chases/
    compare/
    shared/
  domain/
    catalog/
    evidence/
    market/
    analytics/
  repositories/
  data/
    fixtures/
  types/
  lib/
```

This is direction, not a demand to create empty folders.

## Separation of concerns

Bad:

```text
CardGrid.tsx
  → queries database
  → matches variants
  → computes chase state
```

Good:

```text
CardGrid
  ↓
Card/domain service
  ↓
Card repository
  ↓
data source
```

React components should not become the database or business-logic layer.

## Phase 1 storage

First visible build:
- typed local fixture data
- local browser state for Owned/Watching

Even local data should be accessed through a small repository abstraction.

Example:

```text
ProductRepository
CardRepository
CollectionStateRepository
```

This allows later replacement without rewriting the UI.

## Long-term backend

Preferred:
- PostgreSQL
- Supabase as managed PostgreSQL platform
- object storage for approved imagery/evidence
- Supabase Auth only when accounts become necessary

Avoid tightly coupling business logic to vendor-specific SDK calls.

## Domain logic

Business rules belong in domain modules.

Examples:

```text
catalog/
  configuration eligibility
  checklist ordering

evidence/
  surfaced status

analytics/
  cost per numbered card
  surfaced percentage
```

One metric should have one canonical implementation.

## Runtime validation

Use:
- TypeScript for compile-time types
- lightweight runtime validation such as Zod at external-data boundaries

Never trust scraped/imported/API data solely because TypeScript compiles.

## Images

Do not store image binary data in PostgreSQL.

Store metadata in database; image files later go to object storage.

Track image match status separately from usage rights.

## Background ingestion

Do not run large discovery/scraping workflows during normal page requests.

Future jobs should operate independently and write raw/candidate records.

## Deployment

Phase 1:
GitHub → Vercel → responsive web app

Later:
GitHub → Vercel Next.js → Supabase PostgreSQL/Storage

Use separate development/preview/production environments once real production data exists.

## Architectural change control

Important architectural choices should be recorded under:

`docs/decisions/`

Do not silently replace the architecture because another pattern is fashionable.


## Implemented image foundation and future boundaries

Image metadata lives in a separate manifest and generated public sidecar; the checklist importer remains unchanged. scripts/images validates unknown JSON, targets and independent match/rights/approval states, then processes explicitly approved local inputs. No network crawler, page-request ingestion or backend. ImageAsset review metadata stays outside client imports; CardImageRepository joins only the generated public projection to stable card IDs. Missing images use the existing fixture placeholder.

Approved pilot binaries are content-hashed, bounded WebP masters in public/card-images; Next.js handles responsive lazy delivery. The offline processor uses the pinned Sharp version already present through Next.js. Original/private source files never belong in public/ or Git. Storage keys and metadata are separate so object storage can later replace local delivery without replacing the grid. See [ADR 005](decisions/005-image-asset-rights-and-delivery.md).

Future Add Product remains supervised and adapter-based: discovery → candidates → shared validation/review → canonical records. A Release owns shared Cards and multiple Configurations; eligibility belongs to Configuration/Variant relationships. Future accounts/collections, sales/valuations and finite surfaced evidence use separate repositories referencing Card → Variant → FiniteInstance. No new product-specific copy of catalogue identity or UI.
