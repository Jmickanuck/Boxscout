# BoxScout Publication Sharding

## Why this exists

The approved publication snapshot is intentionally database-free at runtime, but the current generated `src/data/published/catalogue.ts` has already grown to roughly 12.6 MB before full Golden Product completion.

That single generated module is acceptable as a migration bridge, not as the long-term scale target. It is expensive for build tooling, Git diffs and AI context, and it encourages whole-catalogue loading when pages need only a slice.

## Goals

Preserve:

- PostgreSQL as canonical catalogue truth;
- approval/digest gate before publication;
- deterministic/offline Vercel browsing;
- zero runtime DB secrets/requests;
- repository/domain abstraction.

Improve:

- file size and Git reviewability;
- AI/token efficiency;
- build/runtime memory;
- ability to load only the release/domain/configuration data a page needs.

## Generated publication layout

The publication writer should emit a compact manifest plus domain shards.

```text
src/data/published/
  manifest.json
  catalogue.ts                 # temporary compatibility output
  releases/
    <release-id>/
      entries.json
      variants.json
      configurations.json
      eligibility.json
      products.json
      intelligence.json
      prices.json
      sources.json
```

`catalogue.ts` remains temporarily so the current application continues to build while Plan 010/011 migrate repositories to shard readers. New features must not deepen coupling to it.

## Manifest

`manifest.json` is the default artifact for agents and operational checks. It should be small and deterministic.

Minimum fields:

- schemaVersion
- publication revision/digest
- aggregate counts
- release IDs/names
- per-release counts

It must not include the entire catalogue.

## AI rule

Agents should inspect `manifest.json`, coverage reports and targeted shard files before considering the monolithic snapshot or raw import payloads.

Do not load `catalogue.ts` into model context merely to learn counts or release names.

## Runtime migration

Migration is incremental:

1. publication writer emits manifest + shards while still writing compatibility `catalogue.ts`;
2. verify shard parity against the canonical `Publication` object;
3. repository readers move to release/domain shard access without changing UI semantics;
4. pages receive only required projections (for example Mega-relevant browse data rather than an entire 60k-variant release where possible);
5. once all consumers and tests use shards, remove the compatibility monolith in a separately reviewed change.

## Shard rules

- Shards are generated artifacts; never hand edit them.
- Ordering must remain deterministic.
- Shard contents must hash back to the same approved publication revision when recomposed.
- Cross-release records are invalid unless the data model explicitly supports them.
- Sources may initially be duplicated per release if they are small; optimize only when measurement justifies it.
- Do not split so aggressively that hundreds of tiny files make deployment/review harder.

## Client boundary

Server repositories may read detailed release shards. Client components should receive bounded UI projections, not raw evidence history or the complete catalogue.

For large card browsing, prefer projections/indexes by release and eventually by box/configuration. Do not send every release variant to an iPhone when the user is browsing one box.

## Thresholds / review triggers

Re-evaluate the publication layout before any of these are exceeded materially:

- 25 MB compatibility snapshot;
- 25,000 variants in one release;
- 5 MB serialized payload to a single client route;
- repeated full-array scans visible in profiling;
- Product #2 requiring duplication of current publication patterns.

These are engineering review triggers, not product limits.

## Current status

The writer may emit shards immediately while the app continues consuming `catalogue.ts`. Repository cutover belongs inside the current recovery work only if it can be proven behavior-preserving; otherwise complete the generated-shard foundation first and cut over before broad catalogue expansion.