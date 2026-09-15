# ADR 007 — AI-Efficient Data Processing and Publication

## Status

Accepted by Justin on 2026-09-15.

## Context

BoxScout's value depends on large structured catalogues, provenance, eligibility, prices and eventually sales/surfaced-card evidence. Full releases can contain tens of thousands of exact variants. Sending bulk source rows or generated publication files through an LLM is expensive, slow and less reliable than deterministic processing.

The current publication snapshot has already grown to roughly 12.6 MB, and import/review files can be multiple megabytes.

## Decision

### Deterministic first

Bulk extraction, normalization, exact comparison, joins, counts, hashes, dedupe and coverage calculations must be performed by normal code wherever practical.

AI receives compact summaries and the unresolved/ambiguous record set, not the whole dataset by default.

### Context guardrail

Generated/raw bulk artifacts are excluded from normal agent reading. Agents start with `AI_CONTEXT.md`, current phase status and the active plan, then load only task-relevant detailed documentation.

### Compact publication manifest

Every approved publication has a small deterministic `src/data/published/manifest.json` containing revision, aggregate counts and release identity. This is the default operational/AI inspection artifact.

### Shardable publication

The publication writer emits release/domain shards in addition to the temporary compatibility `catalogue.ts`. Repositories will migrate to shards before broad catalogue growth makes the monolith costly. See `PUBLICATION_SHARDING.md`.

### Indexed repository access

Server repositories build/reuse lookup indexes rather than repeatedly rescanning whole publication arrays for common release/product/variant relationships.

### Automated verification

GitHub Actions independently runs lint, typecheck, tests and production build on main/PR changes. Local verification remains required.

### Formatting

EditorConfig, ESLint auto-fix and a pinned Prettier command provide a consistent formatting path. Bulk generated/import artifacts are excluded from formatting.

## Consequences

- LLM tokens are spent on ambiguous reasoning rather than deterministic parsing.
- Large raw/generated files remain available for reproducibility without becoming normal model context.
- Publication output can scale across releases/domains without requiring runtime database access.
- Some generated-shard migration work remains before the compatibility monolith can be removed.
- New ingestion work should produce compact coverage/discrepancy reports as first-class outputs.
