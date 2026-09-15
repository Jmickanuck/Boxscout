# PostgreSQL publication and backup runbook

## Approved foundation

BoxScout uses Supabase Free project `abkbniwtvojtjogxscap` (BoxScout, MicknuckSoup), Canada Central `ca-central-1`, PostgreSQL 17.6. No paid service or integration was enabled. Data API is disabled. Existing GitHub → Vercel deployment remains unchanged.

PostgreSQL owns structured catalogue truth. The application reads `src/data/published/catalogue.ts`, a verified database export behind the existing repositories. The current product routes still render on the server, but make **zero database requests**. They remain usable while Supabase pauses. Ordinary builds and Vercel need no database secrets.

Source fixtures are retained for initial import, deterministic generation, tests and emergency recovery. They are not automatically imported on builds. The initial importer supports empty-database import and exact no-op reruns. If an existing catalogue differs, it stops without updating/deleting it. Incremental reviewed edits/imports require a separately reviewed extension; do not bypass this guard to add Product #2.

## Local operator setup

Use Node 24+, npm and PostgreSQL 17 or newer tools. No system PATH change is needed; set `BOXSCOUT_PG_BIN` to the tools directory. Local test PostgreSQL uses loopback port 55432 and disposable `boxscout_test` / `boxscout_restore` databases. Its trust authentication is only for disposable localhost test data; never use that setting for hosted data or accounts. Stop the test server when finished.

Keep `.env.database.local` ignored by Git. It contains `BOXSCOUT_DB_PASSWORD`; `.env.example` lists optional `BOXSCOUT_DB_HOST`, `BOXSCOUT_DB_USER`, `BOXSCOUT_DB_CA`, `BOXSCOUT_REVIEWED_BY`, `BOXSCOUT_TEST_PORT` and `BOXSCOUT_TEST_DATABASE`. `BOXSCOUT_PG_BIN` and `BOXSCOUT_BACKUP_DIR` are optional operator environment settings. Do not put credentials in command arguments, documentation, logs or Vercel. The backup tool passes the password only through its child process environment.

The CA certificate downloaded from the authenticated dashboard's Database Settings link is stored at ignored `.env.database-ca.crt`. Official current certificate: https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt. Both Node and pg_dump verify TLS certificates and hostnames. Never disable verification to fix a connection problem.

Connect through the session pooler on port 5432 for this IPv4 operator environment. The project-specific host and user are defaults in `connection.ts`; other environments can override them. The application does not import this operator connection module. The non-login `boxscout_catalogue_reader` role has SELECT on catalogue tables, RLS SELECT policies, no write access and no import-ledger access. Export explicitly switches to that role. Its visibility covers reviewed canonical data, including data not yet approved for public deployment; a matching approved content hash is independently required before exporting. It is not an anonymous public API role. No anon/authenticated grants are made.

## Migration, validation and publication

1. Fetch/check Git state; run existing generator checks. Review the proposed source/input data and attribution.
2. `npm run db:migrate -- --local` applies/verifies migration hashes in disposable local PostgreSQL. Never edit an applied migration; add a new version.
3. Set `BOXSCOUT_REVIEWED_BY` to the actual approval/review attribution. `npm run db:import -- --local` imports the fixtures transactionally. `npm run db:parity -- --local` compares every domain field, ID, ordering and provenance. A repeated import must be unchanged.
4. `npm run db:migrate`, `npm run db:import`, `npm run db:parity` perform the approved hosted initial migration. No UI cutover occurs here. Conflicting current data causes an error and rollback.
5. `npm run db:backup` writes an export outside the repository. Check successful exit and the generated checksum manifest.
6. `npm run db:approve` validates the graph and records the current content hash as reviewed for publication. RAW/CANDIDATE entries/variants cannot be approved; confidence UNKNOWN/PROBABLE remains representable. This command currently requires full parity to the approved fixture input.
7. `npm run db:publish` reads in a repeatable-read transaction with the read-only role, requires that exact hash in the publication ledger, then atomically writes the snapshot. A failed export leaves the previous file unchanged. Re-exporting the same revision is byte-identical.
8. `npm run publication:check` verifies the snapshot hash, reviewed states and deterministic serialization offline; prebuild runs it. Run application checks, inspect the diff, commit/push the snapshot and verify Vercel Ready for that commit. Database writes alone do not publish. Record a post-publication backup.

`npm run db:test` runs negative and repeatability tests against the **local** test database only. First initialize/migrate/import/approve that disposable database. Tests verify invalid totals, parents, missing default/provenance, cross-release eligibility, restricted role writes, and refusal to export unapproved canonical edits. Test mutations are confined to localhost.

The SQL schema uses typed core columns, primary/unique keys, same-release foreign keys, enum states, serial checks, deferred default checks and publication graph validation. Provenance/subject qualifiers and ordered grouped counts remain JSON where structure is source-specific; source and conflict junctions enforce references. No copied webpage evidence, images or future user/market tables enter the database.

## Manual backups: local only for this approved stage

The approved amendment permits local backups now. Default directory: `C:\Users\Justin\Documents\BoxScout-backups`, outside Git. The command refuses a backup destination inside the repository. It uses pg_dump custom format, application `catalogue` schema only, no owner/password/role exports, plus a SHA-256 and migration-version manifest. There are no image binaries in the dump.

Take exports before/after every approved canonical import or schema migration. Keep at least the latest five publication dumps and three monthly copies during active work. Never delete the last known-good export before checking its replacement. Inspect modification dates and checksums; manual backups do not happen automatically. Code/schema and reproducible licensed inputs remain pushed to GitHub.

Local exports are **not off-device protection**. Before storing irreplaceable user, market or surfaced-card data, add a second off-device/cloud destination, scheduled monitored backups, agreed retention/recovery targets and tested recovery. That later requirement is mandatory; this task does not provision it or add fake keepalive traffic.

## Restore drill and fresh-project recovery

The implemented `restore-test.ts` accepts only an explicit `--local` target and refuses an existing catalogue schema. To rehearse:

1. Create a fresh empty local database, e.g. `boxscout_restore_2`, and set `BOXSCOUT_TEST_DATABASE` accordingly.
2. Set `BOXSCOUT_PG_BIN` to PostgreSQL's bin directory.
3. Run `node scripts/database/restore-test.ts "C:\Users\Justin\Documents\BoxScout-backups\<timestamp>.dump" --local`.
4. The script checks the dump checksum and recorded migration hashes, applies migrations, restores data in one transaction, reads through the restricted role, checks the publication digest and compares full domain data to the bootstrap fixture. A later non-bootstrap catalogue needs comparison to its matching reviewed snapshot, not an obsolete fixture.

For a **fresh Supabase project**, first obtain explicit approval for the replacement project/organization/region; do not overwrite the existing project. Restore the code revision listed in the backup manifest. Configure the new project's connection/CA/password locally and verify the destination before running migrations. Apply the same migrations to the empty project, which recreates schema, roles, grants, policies and the migration ledger. Verify there are no catalogue rows. Then use pg_restore with `--data-only --single-transaction --exit-on-error --no-owner --no-privileges --dbname=postgres` and the dump, with PGHOST/PGPORT/PGUSER/PGPASSWORD/PGSSLMODE=verify-full/PGSSLROOTCERT supplied via local environment. Use direct/session-pooler connectivity, not transaction pooling for this workflow.

This restores data into schema recreated from Git; do not use `--clean` or drop production tables. Run full repository parity against the matching reviewed source/snapshot, publication digest checks and restricted-role tests. Export the restored publication and compare bytes before switching any connection. A Supabase-to-Supabase restore was not provisioned during Plan 006; the actual rehearsal used a separate PostgreSQL 17 database. Future auth/platform schemas and object storage require a broader recovery procedure before those features are introduced.

Application rollback: redeploy the prior verified Vercel/Git snapshot. Database facts are not deleted. Database recovery: use a separate fresh database, verify, then deliberately switch operator connections. An import/export failure never makes the public app depend on an empty or paused database.

## Plan 006 measured baseline

Initial migrated data: one release, one product, one unresolved retailer configuration, eight release configurations, 559 entries, 1,643 variants, 500 eligibility records, seven checklist/configuration source references, five box-intelligence evidence records, 11 box claims, three specifications and two CAD observations, plus relational source/conflict links. The complete data digest is `dca21b6b38c51ed3ed2788afd2bce11e3b1d43cf73a5c1be0fbabea041c56be1`.

Measured before final bookkeeping: database 15,953,043 bytes; catalogue tables/indexes 4,915,200 bytes. First post-publication dump 148,370 bytes. Full restore/parity took approximately 407 ms locally, excluding tool setup; this is a test measurement, not a recovery SLA. The public snapshot file is 1,702,867 bytes / 53,336 gzip, loaded only on the server. Compact browser data is 512,360 bytes / 26,039 gzip (prior 512,360 / 26,038). No database request is added to a page view. Database publication uses one batched relational read plus approval lookup, not N+1 tile queries.
