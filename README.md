# BoxScout

Plan 001: a mobile-first Golden Product slice using Next.js, React, TypeScript, App Router and Tailwind. No database or authentication.

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
- Typed facts and per-record provenance live in `src/data/fixtures/golden-product.ts`.
- Domain functions implement search, image publication checks and independent collection flags.
- Browser storage is confined to the collection repository. Versioned saved data is validated; corrupt/unavailable storage produces a visible warning and is never silently overwritten.
- The Cards client component handles interaction; canonical fixtures remain separate and immutable by type.

## Fixture provenance and limits

24 base identities (#1–24), manually cross-checked on 2026-09-14:

- [Trading Card Database](https://www.tcdb.com/Checklist.cfm/sid/614170/2026-Panini-Prizm-FIFA-World-Cup)
- [Checklist Insider](https://www.checklistinsider.com/2026-panini-prizm-fifa-world-cup-soccer)

VERIFIED applies only to release/base checklist identity, number, player and country. This is not a full checklist, a variant list or a list of confirmed Mega pulls. Mastermind configuration, SKU/UPC, NPP mapping, price and content rules remain unknown in this build. Repository working notes alone are not promoted to sourced product facts.

No external product/card images are copied or loaded. Missing-image metadata and deliberate placeholders are used until publication rights and exact matching are established. The green product illustration is an abstract BoxScout placeholder, not product packaging.

Card details, filters beyond search, Chases, Compare, other products and ingestion are deferred.

## Git on this PC

Use `C:\Program Files\Git\cmd\git.exe` explicitly. The unrelated devkitPro Git and system PATH have not been changed.
