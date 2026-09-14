# ADR 003 — Candidate Before Canonical

## Decision

Automated/AI-discovered data must pass through raw/candidate states before promotion into canonical verified data.

## Reason

BoxScout's value depends on trust and provenance.

AI and web sources can be wrong, incomplete, mislabeled or contradictory.

## Consequence

Future ingestion must never directly overwrite verified canonical records.
