# BoxScout Architecture

Last updated: 2026-09-15.

## Principle

BoxScout is a **modular monolith**. Keep it simple enough for AI-assisted maintenance without creating a throwaway frontend.

Do not introduce microservices, a second backend, or a large framework merely because the catalogue grows.

## Current runtime architecture

```text
Browser / Phone
      |
      v
Next.js 16 / React 19
      |
      v
Server route composition + client interactions
      |
      v
Domain logic
      |
      v
Repository/projection layer
      |
      v
Approved static publication snapshot
```

Ordinary catalogue browsing makes **zero runtime database requests**.

PostgreSQL/Supabase is canonical structured storage, but publication is an explicit reviewed step:

```text
external sources
  -> raw/candidate records
  -> deterministic normalization/validation
  -> discrepancy review
  -> PostgreSQL canonical catalogue
  -> publication approval/digest
  -> deterministic static snapshot
  -> Git/Vercel
```

This keeps the public app fast and usable if Supabase pauses while preserving a real canonical database.

## Source layout

```text
src/
  app/            routes and server composition
  components/     UI only
  domain/         business rules
  repositories/   data-access/projection boundaries
  data/           fixtures + generated publication
  types/          shared contracts

scripts/
  checklists/     extraction/normalization/generation
  database/       migrations/import/parity/publication/backup
  images/         rights-aware image processing

db/migrations/   immutable versioned schema changes
```

Do not create empty layers without a real responsibility.

## Separation of concerns

Bad:

```text
React component
  -> queries PostgreSQL
  -> matches variants
  -> computes eligibility/value
  -> mutates user state
```

Good:

```text
React component
  -> domain/repository projection
  -> approved publication data
```

Business rules such as eligibility resolution, configuration identity, market semantics and future surfaced-card logic belong in domain modules, not JSX.

## Canonical identity model

```text
Release / Set
  -> Box Format
      -> Box Version / Configuration
          -> Retailer Listing / Offer

Release
  -> Card Subset
      -> ChecklistEntry
          -> Variant
              -> future FiniteInstance
                  -> future SurfaceObservation
                      -> Evidence

Configuration <-> VariantEligibility
```

These concepts must remain separate even when the UI groups them for shoppers.

## Repositories and indexes

Repositories are the application boundary around published data.

Common lookups use a shared in-memory catalogue index built once per server module graph. Avoid repeated whole-array scans as the catalogue grows.

Do not let frontend components import generated catalogue files directly.

## Publication scaling

`src/data/published/catalogue.ts` is a temporary compatibility artifact. It is already large enough that agents should not read it as normal source code.

The publication writer now emits:

- compact `manifest.json` for revision/count inspection;
- release/domain shards under `src/data/published/releases/` on the next publication;
- compatibility `catalogue.ts` until repository consumers have migrated safely.

See `PUBLICATION_SHARDING.md` and ADR 007.

Before broad catalogue growth, move repository reads toward the shard/projection model so routes do not parse or send unrelated catalogue data.

## Client payload boundary

Server-side catalogue size and iPhone payload size are different concerns.

Do not send the full release/evidence graph to a client merely because the server can hold it. Large browsing surfaces should receive compact projections, and later configuration-specific views should receive only the relevant card/variant/eligibility slice where practical.

Performance work should be driven by measurements, but repeated full-release scans and multi-megabyte client payloads are review triggers.

## AI/data-processing architecture

LLMs are not the parser/database engine.

```text
large source data
  -> deterministic parser / normalizer / comparator
  -> compact coverage + discrepancy report
  -> AI/human review of ambiguous records
  -> canonical promotion
```

Agents should not load bulk generated/import files into context to perform counts, joins or dedupe. See `AI_CONTEXT.md`.

## Frontend

- Next.js App Router
- TypeScript strict mode
- server components by default
- client components only for interaction/browser state
- mobile-first at iPhone width
- Tailwind/PostCSS plus existing shared CSS/theme tokens
- avoid a large UI framework unless a measured need appears

Owned/Watching and theme preferences remain browser-local repositories during Phase 1 and are separate from canonical facts.

## Images

Image identity/match review and publication rights are independent gates.

Binary images do not belong in PostgreSQL. Approved public derivatives can later move to object storage behind a storage resolver without changing card identity.

Unknown rights => intentional placeholder, not hotlinking.

## Persistence and database

Supabase PostgreSQL is accessed by operator tooling, not application browser code.

Requirements:

- versioned immutable migrations;
- relational integrity and graph validation;
- reviewed imports;
- expected-current-digest protection for incremental updates;
- publication approval before export;
- parity/idempotency/rollback tests;
- backups independent from Git.

See `PERSISTENCE_RUNBOOK.md`.

## Background ingestion

Do not perform large scraping/discovery workflows during normal page requests.

Future ingestion jobs/adapters should produce raw/candidate observations and feed the same validation/review pipeline. Adding a new product should become a supervised import workflow rather than copied pages or product-specific application logic.

## CI and code hygiene

GitHub Actions independently runs:

- lint
- TypeScript checks
- application tests
- production build (including deterministic publication/generator checks)

Local checks remain required.

EditorConfig defines basic whitespace/EOL rules. `npm run lint:fix` handles safe ESLint fixes. A pinned Prettier command is available for intentional formatting passes; bulk generated/import artifacts are excluded.

## Change control

Record meaningful architectural decisions under `docs/decisions/`.

Do not rewrite healthy code merely to adopt a fashionable pattern. Prefer small, tested migrations that preserve stable identities and user-visible behavior.
