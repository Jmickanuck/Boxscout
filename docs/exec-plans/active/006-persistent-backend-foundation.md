# Execution Plan 006 — Persistent Backend Foundation

## Status and boundary

PROPOSED — planning/research only, checked 2026-09-14. Requires explicit implementation approval. Baseline: `2526ef137e5120a343f0d886318b68f39c17b912` on main. This task creates this document only. No Supabase project, credentials, dependencies, application changes or paid infrastructure are introduced. AGENTS.md's active-plan pointer is intentionally unchanged until implementation is approved.

Read AGENTS.md and the relevant PRODUCT, ARCHITECTURE, DATA_MODEL, DATA_INTEGRITY, UI_SPEC, GOLDEN_PRODUCT, ASTRA_RUNBOOK, monetization/backup policy, ADR 006 and Plan 005 implementation record. The approved Plan 005 amendments and completed implementation supersede its historical proposed counts and unspecified-ownership proposal.

## Recommendation

Use managed PostgreSQL on Supabase Free for the next bounded persistence foundation, conditional on account availability, an agreed offsite export destination and a successful recovery rehearsal. PostgreSQL suits shared identities, configuration relationships, evidence and eventual transactional collections. The present fixture approach is still practical: persistence is a shared-authority decision, not an emergency performance or storage fix.

Keep standard SQL migrations, a small PostgreSQL driver and domain repository interfaces. Supabase-specific code should be limited to deployment/connection instructions; no Supabase SDK in React. Another managed PostgreSQL host remains a viable replacement. Self-hosting would add operational responsibility without a demonstrated saving; a local database file is not an appropriate shared durable store for Vercel deployments.

Recommended first cut: PostgreSQL owns approved structured data; a verified, versioned public snapshot feeds the existing static application. The PostgreSQL repository is used by the publication/build process, behind the same application interface as fixtures. Do not introduce a live database request on every page view merely to demonstrate persistence. Freshness requirements for future market observations can justify separately cached server reads later.

## Current inventory and migration boundary

| Migrate into PostgreSQL now | Preserve outside PostgreSQL |
| --- | --- |
| One release, 559 checklist entries, 1,643 variants and eight configuration-family records | Reviewed source manifests, normalized factual import inputs, discrepancy records and deterministic generators |
| 500 explicit configuration eligibility records, including their confidence and sources | Existing generated fixtures as contract-test oracles and reproducible bootstrap inputs |
| Product/listing identity and its independently assessed configuration mapping | Existing routes, compact browser projections, search/filter logic and canonical four-column tiles |
| Source references, dated evidence, specifications, source-specific box-content claims and conflicts | Plan 004 image metadata/generation/publication-rights workflow and binary assets; no image migration in this task |
| Existing retailer identifiers and both dated sealed-price observations | Theme preference and `boxscout:collection:v1` browser-local state |

The 559 entries comprise 500 Base, 25 Base Variations, 25 Aces and nine 1994 Team USA Signatures. Preserve all existing entry, variant, configuration, evidence, claim and observation IDs byte-for-byte. Where an existing structure has no ID, create a documented stable mapping once, not a new random ID on each import.

The current unresolved retailer configuration object `mastermind-mega-unresolved` is distinct from the eight release configuration families. Preserve that identity as a product configuration assessment subject, not a ninth verified family. Mastermind's link to NPP Mega remains PROBABLE. Verified Red Disco-to-NPP family eligibility must not upgrade this exact retail mapping. Missing eligibility remains UNKNOWN, not EXCLUDED.

Post-cutover, approved database publications are authoritative. Historical fixture files remain bootstrap/test material; they must not overwrite later database edits automatically. Generate new public snapshots from a verified database revision, with revision/hash metadata. Do not maintain two independently edited canonical catalogues.

## Relational schema proposal

Use an application-owned `catalogue` schema and a restricted `ingest` schema. Text primary keys preserve current IDs. Use SQL enums for established closed states; migration changes are required to add states. Separate verification (`RAW`, `CANDIDATE`, `REVIEWED`, `VERIFIED`), confidence (`UNKNOWN`, `PROBABLE`, `VERIFIED`) and publication status. A published uncertain assessment is permissible; publication does not mean factual verification.

| Tables | Identity and constraints |
| --- | --- |
| `releases`, `subsets` | Release PK; subset PK and UNIQUE(release_id, stable_key). Names are editable display facts, not identity. |
| `checklist_entries` | PK preserving current card ID; release/subset FKs; UNIQUE(release_id, subset_id, card_number, identity_discriminator). Printed numbers remain text; discriminator defaults to empty text, never NULL. Entry type supports BASE, INSERT, AUTOGRAPH, RELIC, MEMORABILIA, VARIATION, OTHER. Nonempty display name, numeric sort order; nullable supported country/team. Preserve existing player-name projection. |
| `variants` | PK; entry FK; UNIQUE(entry_id, edition_key). Edition key is stable and does not include correctable serial total or display spelling. Partial UNIQUE(entry_id) WHERE is_default ensures at most one default. A deferred constraint trigger ensures exactly one default for the current entry families requiring it. No synthetic default for a future parallel-only family. Current default variant IDs continue to equal entry IDs. |
| `configurations` | Eight existing family IDs, release FK, name, confidence and dated provenance. Add UNIQUE(id, release_id) for composite references. Future releases use namespaced new IDs without renaming these existing IDs. |
| `variant_eligibility` and `eligibility_source_links` | Preserve existing assessment IDs; UNIQUE(configuration_id, variant_id) for effective assessment. Status INCLUDED/EXCLUDED/UNKNOWN/CONFLICTING, confidence, rationale, date and linked source assertions. Multiple contradictory assertions remain stored; effective status must expose conflict. Missing row is unknown. |
| `sources`, `source_observations` | Source identity, URL/name/authority; observations store locator, checked date, source-specific statement, qualification, verification, optional content hash. Separate source identity from repeat observations. Do not copy complete third-party pages. |
| Typed evidence junctions | Entry, variant, configuration, eligibility, release, product and claim evidence links use real FKs. Avoid a generic target_type/target_id table with unenforced references. Deferred publication validation requires provenance for every published factual record. |
| `products`, `product_configuration_assessments` | Stable product ID and unique route slug; release FK; preserve unresolved assessment ID/raw designation and nullable family FK. Mapping confidence, rationale and supporting links stay separate from family confidence. |
| `retailers`, `retailer_listings`, `retailer_identifier_claims` | Preserve listing IDs, URLs, storefront variant and source-specific SKU/UPC claims. Keep identifiers as text. Do not declare UPC globally unique across listings or silently reconcile competing claims. Internal retailer keys are not evidence of identity. |
| `configuration_link_claims`, `packaging_specifications`, `box_content_claims`, `claim_inclusions`, `claim_conflicts` | Preserve exact source scope, original qualifiers and nullable quantities/semantics. Subject scope and original value survive even when no family FK is justified. Resolved family/listing references are optional, explicitly constrained to their declared scope. Link claims retain MATCHING_UPC_CONTENTS versus EXPLICIT_UPC_FAMILY distinctions. Conflicts link both original claims. |
| `sealed_price_observations` | Existing observation PK, product/listing FK, nonnegative integer minor units, currency, observed timestamp, availability and shipping/tax uncertainty, sale unit/type and evidence. Both existing CAD observations remain independent; equal price is not a duplicate. |
| `ingest.import_batches`, `catalogue.publications` | Input checksum, importer/schema version, review decision, counts, canonical digest and publication timestamp. Minimal staging payload is allowed as JSON, but published core relationships are relational. No admin UI or generalized queue system. |

Add composite FKs using `(id, release_id)` so entries/subsets, variants/entries and eligibility/configuration/variant references cannot cross releases. Keep the release field on relationship rows for this enforcement. Add indexes on entry release/subset, variant parent, eligibility configuration/variant and listing observation time; no speculative search engine.

Numbering constraint: NUMBERED requires `serial_total IS NOT NULL AND serial_total > 0`; UNNUMBERED and UNKNOWN require NULL. Preserve their distinction. A /99 variant remains one row. Autograph characteristics remain separate from entry type; nullable relic information must not become false by default. Preserve variation parent links with a same-release FK, no self-link and a validation trigger for permitted parent type.

Use `date` for source checks known only to a day and `timestamptz` for actual observed instants; never invent midnight observation precision. Retain creation/update timestamps separately from evidence dates. Published claim quantity may be NULL where unknown. GUARANTEED and PER_BOX_AVERAGE remain distinct source statements; the domain service continues the conservative presentation rule.

Cross-row truths need FKs, unique indexes or constraint triggers, not CHECK expressions that query other rows. PostgreSQL explicitly cautions against cross-row CHECK constraints. All trigger rules must have negative integration tests. [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

## Future boundaries, without future tables/features now

- `FiniteInstance` will reference a variant and carry an integer serial ordinal, with UNIQUE(variant_id, serial_ordinal). A trigger will check ordinal against the parent's serial total and reject incompatible later total edits. No 99-row expansion for /99 during import.
- `SurfaceObservation` will reference an instance or explicitly unresolved candidate identity and link Evidence. Observations are not proof that all unobserved copies remain sealed. Verified 1/1 surfacing and configuration eligibility remain separate evidence paths.
- `MarketObservation` will distinguish asking/listing prices from confirmed sales, with currency, date, quantity and graded/raw context. `ValuationSnapshot` will reference its method/version and evidence, not overwrite sales.
- Future User/profile IDs can reference an authentication provider at an adapter boundary. CollectionEntry references Variant and supports quantity, optional exact instance, condition, grading, acquisition price and later valuations. Watchlist is separate from ownership. None of these tables or accounts is required now.
- Retailer offers/affiliate relationships can reference existing retailer/listing/product identities; commission must never enter factual ranking logic. Import batches can later support supervised candidate/review queues and Product #2 publication into shared tables.
- A future variant-detail service can compose exact identity, image, configurations, serial total, sales/sightings, valuation, surfaced evidence and personal state by stable variant ID. No new route now. Existing image variantId remains structurally compatible; publication rights stay independent of match verification.

Existing browser state needs no destructive migration: Base/default variant IDs retain the current entry IDs. Keep v1 serialization and independent Owned/Watching toggles exactly as implemented. Database catalogue import never reads, uploads, clears or rewrites personal browser state.

## Safe import and publication sequence

1. Record a clean synchronized Git baseline and run existing generators/validation. Capture sorted canonical payloads, counts and hashes from current repositories, including all evidence and price observations.
2. Apply versioned migrations to an isolated local PostgreSQL database first. Match the hosted major version once known. Import a reviewed manifest through the existing normalization layer and a small shared database importer.
3. Stage and validate the complete graph. Use a transaction and publication lock. Upsert only by stable IDs; identical input is a no-op. If an existing row differs from the expected prior digest, stop for review instead of overwriting a newer edit. Observations are append-only; same ID/different payload is an error. Never delete rows simply because an input omits them.
4. Read back through PostgreSQL repositories. Compare sorted domain output, IDs, fields, evidence, uncertainty, prices and hashes to fixture output, not just row counts. Verify a second import changes nothing. Publish only after parity passes.
5. Export a compact, deterministic, versioned public snapshot from one consistent database transaction. Keep private staging/evidence restrictions out of it. Attach publication ID and digest; use the same projection contract as the current browser.
6. After approval to provision, repeat in Supabase with an initial export and verified offsite copy. Build a preview from the database-derived snapshot; test it before switching production. Do not require a live production database connection for unrelated preview/test builds.
7. Cut over by deploying the verified snapshot and repository selection. Preserve the last verified deployment and bootstrap fixture path for explicit rollback. Do not silently fall back to older data while claiming a new publication succeeded.

Use forward additive migrations first. On import failure, roll back the transaction. On application regression, restore the previous verified deployment/snapshot without deleting database facts. For database recovery, restore into a separate database, compare data and permissions, then switch connections deliberately. No DROP/recreate production shortcut or automatic destructive down migration.

After cutover, source inputs are proposed imports. Publishing runs the same review, transaction, parity and export checks. A failed database connection/export leaves the previous public revision serving; it must not produce an empty catalogue or mark stale price observations as current. The next successful publication explicitly advances the revision.

## Repository and rendering design

Introduce asynchronous catalogue/variant repository interfaces at the server/application boundary, with fixture and PostgreSQL implementations. Keep domain validation, confidence assessment, search and rights selection independent of SQL/Supabase. UI components receive unchanged public domain projections.

Use a small parameterized PostgreSQL adapter, explicit ordered queries and a consistent read transaction. Target at most eight batched reads per release snapshot, independent of variant count. Load related sources in batches; never issue a query per tile. The current 500-default/1,643-explicit-result behavior stays unchanged.

For this read-mostly catalogue, prefer **publication-time static generation**: a trusted local publication command reads PostgreSQL, validates and generates the public snapshot; the reviewed snapshot is committed/pushed, then Vercel builds it. PostgreSQL remains canonical and Git records delivery artifacts. Normal page views need zero PostgreSQL calls. Label the snapshot revision in machine-readable metadata, not new UI clutter. A failed publication leaves the old revision intact; no automatic fixture substitution. Existing dated price labels preserve the observation's age.

This keeps current static performance and allows Supabase Free pausing without taking the public catalogue offline. Do not add artificial keepalive traffic. A later need for frequent prices/sightings can introduce separately cached server reads with explicit invalidation, without changing React's data boundary. Next.js distinguishes data and route caches; verify the installed version's behavior before using live-query cache APIs. This task does not need a cache-framework migration. [Next.js caching](https://nextjs.org/docs/app/guides/caching-without-cache-components)

Baseline from Plan 005: compact browse projection 512,360 bytes / 26,038 gzip; page HTML/React payload approximately 1,132,170 bytes / 52,796 gzip; domain filtering p95 below 5 ms in the recorded local run. Repeat the same measurements; allow no unexplained payload increase beyond 10% or visible mobile regression. These are comparison targets, not field latency guarantees. Measure database export latency, query count, relation sizes and index usage separately. No virtualization/pagination/library additions without evidence.

## Environments and security

- Development: disposable local PostgreSQL, preferably Docker, plus fixture mode for ordinary UI work. Docker executable is discoverable; daemon readiness is unverified. psql/pg_dump were not found on the command path; verify tools during implementation. Full local Supabase is optional, not needed for plain SQL catalogue tests.
- Production: one Supabase Free project, subject to available account quota. Choose a supported region near the existing Vercel execution location after checking both; confirm any future Canadian data-residency requirement before user data arrives. No paid branching project.
- Preview/CI: deterministic fixtures and isolated PostgreSQL integration tests; no production write credentials in pull-request environments. Vercel production serves the committed public snapshot and needs no database secret in this first cut.
- Trusted publication environment: `CATALOGUE_DATABASE_URL` for a dedicated read-only export role. Separate `MIGRATION_DATABASE_URL`/import credentials available only to the operator; an example file contains placeholders, never values. Ignore local secrets/dumps. Never use NEXT_PUBLIC for database secrets or ship a service-role key to the browser. No Supabase client keys are needed for this design.
- Use TLS with certificate verification and parameterized SQL. Database owner/migration credentials must not be application runtime credentials. Restrict import writes to the import process; no public mutation endpoint.

For a future Vercel live-read adapter use the transaction pooler with a small per-instance pool, respecting actual project connection limits and disabling incompatible prepared statements. For migrations/exports use direct or session-pooler connections where required; IPv4 availability must be checked. Do not copy paid Micro connection limits onto Free. [Supabase connection guidance](https://supabase.com/docs/guides/database/connecting-to-postgres)

Disable the unused Data API. Keep catalogue/staging schemas unexposed, revoke PUBLIC/anon/authenticated access, and grant the export role only necessary published reads. Enable RLS on application tables as defense in depth; policies allow the dedicated non-owner, NOBYPASSRLS reader to read published data only, with no writes. Staging gets no reader policy. Verify owner bypass is not accidentally used by the export role. Later user tables require ownership policies and server authorization with dedicated tests before any browser/API exposure. [Supabase API hardening](https://supabase.com/docs/guides/api/securing-your-api), [RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Backup and recovery

GitHub backs up migrations, import inputs and reviewed public snapshots; it does not back up database-only changes. Supabase recommends regular exports and offsite copies for Free projects. Database backups exclude Storage binary objects. [Supabase backups](https://supabase.com/docs/guides/platform/backups)

Before cutover, choose an existing private offsite destination owned by Justin. Recommended: encrypted application-schema exports copied to an existing private cloud drive, with encryption keys stored separately. Do not assume an account/destination or provision storage. Do not commit whole database dumps, credentials or future personal data to GitHub. If no suitable destination exists, keep fixture delivery and defer canonical cutover until one is approved.

Implement an operator-run export/verify procedure using pg_dump or Supabase CLI with explicit application-schema scope. Include schema version, row counts, canonical digests and restore instructions; version grants/policies/functions in migrations. Exclude platform internals only deliberately: future auth/storage adoption will require expanding the recovery procedure. Capture before and after every approved import/migration; take a weekly export during weeks with database writes. Verify the offsite copy's checksum before declaring publication complete. Keep at least the latest five publication backups and three monthly snapshots; no paid service is required at current size.

Restore into isolated PostgreSQL before first cutover, after structural migrations and monthly during active persistent-data development. Reapply versioned roles/grants safely, compare domain hashes/counts, exercise RLS and read repositories, and rebuild the public snapshot. Record the actual recovery time and successful backup timestamp in the runbook. Proposed prototype target: recover the last approved publication within four hours; validate rather than promise it.

Current approved catalogue changes should have zero unbacked publication loss: deterministic input plus before/after exports must exist. Manual exports are acceptable only while writes are controlled and data is reproducible. Before irreplaceable user/market/sighting data arrives, require automated monitored offsite backups with an agreed recovery point (proposed at most 24 hours), tested restore and a named owner. That automation and any higher durability plan are a separate approval. Images/evidence binaries need their own storage backup/versioning when introduced.

## Current costs and capacity

Checked against [Supabase pricing](https://supabase.com/pricing) on 2026-09-14: Free is US$0/month, 500 MB database per project, shared CPU/500 MB RAM, unlimited API requests, 5 GB egress plus 5 GB cached egress, 1 GB file storage, 50,000 monthly active users and two active projects. Automatic backups/PITR are not included. Pro starts at US$25/month. Unlimited requests do not mean unlimited compute, connections or bandwidth; cached egress is not a general extra PostgreSQL allowance.

Free projects may pause after a week of low activity. Static publication isolates browsing from that downtime, but an operator may need to resume the project before importing/exporting. [Pausing policy](https://supabase.com/docs/guides/platform/free-project-pausing)

Planning estimates, not measurements of an unprovisioned database:

| Resource | Expected initial use / verification |
| --- | --- |
| Application tables/indexes | Budget 10–30 MB for this small relational graph and evidence; measure actual relation/database size after import, including platform overhead against the quota. |
| Hosted API/auth/storage | No client API, zero account users and zero Storage binaries introduced. Future auth allowance is not approval for accounts or email services. |
| Database egress | Publication-only exports should be small. A hypothetical 1 MB export repeated 100 times is roughly 100 MB before protocol overhead; measure actual usage. Normal browsing adds no database egress. |
| Vercel/client payload | Expected near existing snapshot size. No extra database round trip on page views. |
| Backups | A handful of compressed small exports should fit existing private storage; inspect actual dump size and retained total. |

Review at 70% of measured storage/egress allowance or sustained connection/CPU constraints; do not auto-upgrade. Paid infrastructure becomes justified by reliable always-on write/read needs, recovery requirements, measured limits or support needs, not simply by adding more variant rows. Future images and append-only observations may dominate cost. Recheck pricing/account quotas before implementation approval is acted on. Development subscriptions remain separate from runtime costs.

## Expected implementation files

Exact filenames may adapt to existing conventions; no files in this section change during planning.

- `db/migrations/`: ordered core identity, provenance/commerce, publication and security SQL migrations; no future account/market tables.
- `src/repositories/`: shared contracts and fixture/PostgreSQL adapters; `src/lib/server/` connection boundary if needed by existing conventions.
- `scripts/database/`: deterministic import, parity, export, backup/restore verification commands using existing normalized inputs.
- `src/data/fixtures/` remains; add a clearly versioned generated published snapshot/manifest and explicit provider selection behind repositories. Avoid duplicating the snapshot in the browser bundle.
- Focused database integration/contract tests; package scripts and the minimal PostgreSQL driver only if needed. No Supabase UI/client SDK.
- `.env.example`, relevant ignore entries and optional local PostgreSQL compose configuration, with no secrets.
- ARCHITECTURE, DATA_MODEL, DATA_INTEGRITY, ASTRA_RUNBOOK/backup procedure, AGENTS and this plan updated on approved implementation. UI_SPEC changes only if clarification of unchanged delivery is needed.

## Acceptance criteria and tests

1. SQL migrations apply to a fresh database; import yields exactly 559 entries, 1,643 variants, eight families, 500 eligibility assessments and both price observations. All original IDs and the complete evidence graph round-trip without loss.
2. Fixture/PostgreSQL repository contract outputs match after deterministic sorting. Repeated imports/exports produce identical domain digests; import conflicts stop instead of overwriting. Failed import leaves the prior publication intact.
3. Negative SQL tests reject duplicate identities, invalid parents/cross-release eligibility, invalid serial totals, duplicate defaults and missing required publication provenance. Conflicting/unknown claims remain representable; missing eligibility stays unknown. No finite-copy expansion.
4. Exact Mastermind mapping remains PROBABLE; source-average and guarantee claims remain separate. Exported public data excludes staging and secrets. Read role cannot mutate data or read candidates; anon has no access. No service credentials in build output/client bundle/logs.
5. Existing Base IDs and v1 storage survive switching data provider/snapshot. Owned and Watching remain independent, including parallel state. Search/filter results and strict/probable configuration behavior match the baseline.
6. Publication snapshot remains deterministic and pages work with PostgreSQL offline. A failed publication never advances the advertised revision. Restore drill reproduces IDs, hashes, policies and rendered data from the offsite export.
7. Record relation sizes, query count/export duration and page/projection payloads. Test mobile Cards at 375×812 and 390×844, default 500, representative filters, toggle/refresh, no horizontal overflow or console-breaking errors. Preserve theme and canonical tiles; targeted smoke tests only.
8. Run lint, typecheck, relevant unit/SQL integration tests and production build. Review diff, commit/push, verify GitHub synchronization and Vercel Ready for the same commit, and clean working tree. Report database revision, backup/restore results and any blocked cutover separately from application deployment.

## Decisions needed before implementation/cutover

- Confirm acceptance of Free pausing for the operator while the public app serves verified static snapshots. Recommended for this prototype.
- Select/approve an existing private offsite backup destination and key custody; this is a prerequisite to canonical cutover, not permission to add paid storage.
- Check Supabase account/project availability, region and local PostgreSQL tooling. No account/project was inspected or provisioned during planning.
- Approve publication-time snapshots as the initial database delivery path. This deliberately does not promise immediate UI updates after database writes; every approved publication deploys a verified snapshot. Live observations can receive a separate caching design later.

No new source conflicts are resolved by this plan. Existing factual discrepancies, incomplete eligibility coverage and image-rights limitations survive unchanged. Do not implement accounts, variant detail pages, importer administration, market/sighting ingestion, valuations, chase calculations, monetization, images or another product.

## Planning completion

Review this document's consistency and links, verify that it is the only changed path, commit and push to origin/main, fetch and compare local main/origin/main/live remote, then stop for approval. Application test/build commands are not required for this documentation-only change under AGENTS.md.
