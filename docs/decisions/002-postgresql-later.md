# ADR 002 — PostgreSQL as Future Canonical Database

## Decision

When BoxScout moves beyond typed fixtures, use PostgreSQL as the preferred canonical structured database, likely through Supabase.

## Reason

The core model is relational:
- releases
- configurations
- cards
- variants
- evidence
- finite instances
- prices

Relational constraints are valuable for data integrity.

## Consequence

Do not introduce a database during Bootstrap Plan 001.

Repository abstractions should allow fixtures to be replaced later.
