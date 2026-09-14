# BoxScout

Plans 001–003: a mobile-first Golden Product slice using Next.js, React, TypeScript, App Router and Tailwind. No database or authentication.

## Run locally

Use Node.js 24 LTS and npm. In this repository:

```powershell
npm install
npm run dev
```

Open http://127.0.0.1:3000. The server binds to this PC only. A different browser or origin has separate Owned/Watching state. Clearing site data removes that state. It does not sync to other devices.

Production verification: run `npm run build`, then `npm start`.

## Checks

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

The test command uses Node's built-in test runner and TypeScript stripping. No extra test runtime is needed.

## Boundaries

- Server routes read catalogue data through `src/repositories/catalog-repository.ts`.
- Typed facts are composed in `src/data/fixtures/golden-product.ts`; the reviewed base checklist is generated under `src/data/fixtures/generated/`.
- Domain functions implement search, image publication checks and independent collection flags.
- Browser storage is confined to the collection repository. Versioned saved data is validated; corrupt/unavailable storage produces a visible warning and is never silently overwritten.
- The Cards client component handles interaction; canonical fixtures remain separate and immutable by type.

## Fixture provenance and limits

500 base identities (#1–500), cross-checked on 2026-09-14 through a reproducible import:

- [GTS distributor workbook](https://gogts.net/wp-content/uploads/2026/06/2026-Panini-Prizm-FIFA-World-Cup-Soccer-Cards-Checklist.xls)
- [Trading Card Database](https://www.tcdb.com/Checklist.cfm/sid/614170/2026-Panini-Prizm-FIFA-World-Cup)
- [Checklist Insider](https://www.checklistinsider.com/2026-panini-prizm-fifa-world-cup-soccer)

VERIFIED applies only to release/base checklist identity, number, player and country. This is the complete base checklist, not a variant/insert list or a list of confirmed Mega pulls. Plan 002 adds sourced Mastermind SKU 256877 and retailer-reported UPC 746134202520. NPP mapping is PROBABLE: matching-UPC retailer descriptions corroborate the Panini NPP sell sheet, but no authoritative exact UPC-to-NPP bridge was found. Canonical manufacturer SKU/UPC and pack-count scalar fields remain null; attributed candidate specifications are separate. No card eligibility is inferred.

No external product/card images are copied or loaded. Missing-image metadata and deliberate placeholders are used until publication rights and exact matching are established. The green product illustration is an abstract BoxScout placeholder, not product packaging.

Card details, filters beyond search, Chases, Compare, other products and image ingestion are deferred.

## Checklist import (Plan 003)

Run `npm run checklist:generate` to replay reviewed factual extracts offline, or `npm run checklist:check` to detect drift without writing. No new runtime dependency, network or Python is needed for replay. See [the import guide](data/imports/golden-product-base/README.md) for sources, six explicit resolutions, pinned hashes, temporary source extraction and reuse for future releases. All 24 existing IDs and `boxscout:collection:v1` are preserved. Canonical Card identity remains separate from personal ownership. The approved tile, search semantics and routes are unchanged.

## Configuration intelligence (Plan 002)

The Overview shows sourced identifiers, qualified 6 × 7 packaging counts, source-specific average content claims, conflicting sell-sheet guarantee wording, and two real CAD $119.99 listing-price observations from Mastermind on 2026-09-14 (20:20:41.132Z and 20:30:25.573Z). Availability is unresolved, tax treatment unknown, and shipping is separate. These are dated quotes, not live prices or completed sales.

Panini's official release article is preferred for release identity. The distributor-hosted Panini NPP sell sheet supports family facts; matching-UPC retailers support probable exact-box applicability. Full links, checked dates and source-specific qualifications are in the Overview and golden-product-configuration fixture. Conflicting wording is retained, never merged into a stronger promise.

Configuration/price data is exposed through the catalogue repository; domain functions control mapping confidence, source priority, claim applicability, and latest valid CAD observation selection. Personal collection storage is unchanged. No packages, routes, images, products, or background data fetching were added.

## Git on this PC

Use `C:\Program Files\Git\cmd\git.exe` explicitly. The unrelated devkitPro Git and system PATH have not been changed.
