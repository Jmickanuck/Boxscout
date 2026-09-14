# Golden Product base import — reviewed 2026-09-14

500 base records, numbers 1–500, from the exact 2026 Panini Prizm FIFA World Cup release. VERIFIED means reviewed release/base number, player and country, not physical print inspection, variants, odds, image rights or exact Mega eligibility.

## Sources and retention

- Preferred authority: [Panini checklist selector](https://www.paniniamerica.net/checklist.html). No usable exact-release export was obtained in the bounded checks. The [official release article](https://blog.paniniamerica.net/panini-prizm-fifa-world-cup-2026-hits-the-net/) confirms the release but does not enumerate 500 cards. Panini NFT/Monopoly/sticker results are different products and were not imported.
- Primary 500 rows: [GTS distributor workbook](https://gogts.net/wp-content/uploads/2026/06/2026-Panini-Prizm-FIFA-World-Cup-Soccer-Cards-Checklist.xls), linked by its [release article](https://gogts.net/2026-panini-prizm-fifa-world-cup-soccer-cards-checklist/). Binary XLS; worksheet `2026 Panini Prizm World Cup (25`, 55,680 rows, six columns. Exact CARD SET `Base` yields 500 rows at spreadsheet rows 1717–2216. Prefix matching would include many parallel sets and is forbidden.
- Independent full comparison: [Checklist Insider](https://www.checklistinsider.com/2026-panini-prizm-fifa-world-cup-soccer), only the single 500-row Base Checklist block, before team lists and other subsets.
- Targeted resolution checks: TCDB base checklist [page 2](https://www.tcdb.com/Checklist.cfm/sid/614170/2026-Panini-Prizm-FIFA-World-Cup?PageIndex=2), [page 3](https://www.tcdb.com/Checklist.cfm/sid/614170/2026-Panini-Prizm-FIFA-World-Cup?PageIndex=3), [page 6](https://www.tcdb.com/Checklist.cfm/sid/614170/2026-Panini-Prizm-FIFA-World-Cup?PageIndex=6). Only the five relevant factual rows are retained; this is not a claim of full TCDB agreement. TCDB pages contain `b` variation rows that are excluded.

`manifest.json` pins source URLs, exact retrieval timestamps, checked dates, authority, coverage, original-download SHA-256 (where available), and factual-extract SHA-256. TCDB was inspected through web retrieval, so no original-byte hash is claimed. `raw/*.json` contains only factual row extracts and source locators. Complete downloaded pages/workbooks were temporary outside the repository; no images or copied article text are retained. Hashes attest bytes, not correctness or rights.

## Reconciliation

All 500 numbers and countries agree between GTS and CI. Generic normalization is only Unicode NFC, whitespace collapsing and trimming; HTML entities are decoded by the source adapter. Accents, apostrophes, aliases and disambiguation suffixes are never silently rewritten.

`discrepancies.json` retains six reviewed differences with original normalized source values, selected display value, rationale, evidence IDs and date:

- #93 Marquinhos `(D)`, #186 Luis Suarez `(COL)`, #483 Ladislav Krejci `(D)`: distributor suffixes retained in extracts; CI and TCDB corroborate display names at those base numbers.
- #105: GTS says `Anthony rdon`; CI and TCDB base agree on `Anthony Gordon`.
- #139: GTS apostrophe is mojibake; CI has a curly apostrophe and TCDB a straight one. Use CI's intact punctuation, with both alternatives preserved.
- #483 country: TCDB says Czech Republic; GTS/CI say Czechia. Retain GTS/CI label, record the equivalent label explicitly.

A search result for a TCDB Wave parallel used Ahmed Maknzi at #459. The [TCDB base page 5](https://www.tcdb.com/Checklist.cfm/sid/614170/2026-Panini-Prizm-FIFA-World-Cup?PageIndex=5) lists Ahmed Hasan, agreeing with GTS/CI. The parallel result is out of scope and is not base evidence; no person-alias or variant equivalence is asserted. TCDB may also use diacritics/alternate country labels elsewhere; it has not been fully reconciled. Different publishers can share upstream errors, so multi-source agreement is not a guarantee against a future correction.

No unresolved substantive base differences remain in the imported evidence. New differences or stale resolution values stop VERIFIED generation. The existing fixture is preserved on validation failure. Review decisions are explicit; the generator does not auto-approve sources or choose majority values.

## Replay and reuse

Offline, with the existing Node 24 toolchain and no new application dependencies:

```powershell
npm run checklist:generate
npm run checklist:check
npm test
```

`scripts/checklists/normalize.ts` provides release-independent typed normalization, source coverage validation, discrepancy gating, provenance assembly, legacy identity protection and canonical serialization. `generate.ts` verifies extract hashes and writes/checks the manifest's output. Another release can supply the same small manifest/extract/ledger contract with its own ID prefix, count and source adapter. No product-specific names or counts are embedded in those reusable functions.

To repeat extraction from downloads, use a temporary Python environment with `xlrd==2.0.2`, then:

```powershell
python scripts/checklists/extract-prizm-2026.py <download.xls> <download.html> <temporary-output-directory>
```

The adapter is intentionally product-specific and rejects unexpected workbook headers or block layout. Never download into the repository or run it directly against the reviewed raw directory. Compare new extracts and download hashes, inspect changes, update the manifest/ledger through review, then generate. Do not automatically refresh checked dates, evidence hashes or review status. The generator's offline replay needs no Python, network or XLS package.

`legacy-identities.json` is the immutable 24-card identity baseline from commit e8f6c19. Names and country cannot silently change alongside IDs. No local storage migration, overwrite or pruning occurs; canonical identity remains separate from owned quantities, user entries, future variants/finite instances and observations.
