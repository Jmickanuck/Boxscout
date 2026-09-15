# Plan 009 — Retail Mega identity and eligible checklist

Status: research in progress; compare contents before deciding whether retailer versions need separate box options. No canonical changes approved by this research record.

## Objective
Complete the cards and variants eligible for the selected retail Mega, preserving the existing backend, stable identities, personal collection state and publication gate. Collect evidence from actual product listings and packaging so this work specifies a reusable ingestion process.

## Identity findings — 2026-09-15

- Target lists UPC **746134202551**, TCIN 95267129, DPCI 361-02-4848, six packs of seven cards. Its description advertises Disco Prizms, autographs, Color Blast, Manga, Prizmania and Alter Ego as possible content. [Listing](https://www.target.com/p/panini-prizm-fifa-world-cup-2026-soccer-trading-card-mega-box/-/A-95267129).
- Existing pilot is Mastermind/Collectors Emporium UPC **746134202520**. [Collectors Emporium](https://collectorsemporium.com/en-ca/products/2026-panini-prizm-fifa-world-cup-trading-cards-mega-box) exposes the same UPC and NPP/Red Disco description.
- Different UPCs must remain distinguishable in candidate evidence, but do not alone prove different card contents or require separate public box options. Matching 6 x 7 counts also do not establish equal contents. Do not transfer the existing NPP Red Disco eligibility to Target.
- [Northwest Sportscards](https://www.nw-sportscards.com/products/2026-panini-prizm-fifa-world-cup-soccer-target-retail-mega-box) explicitly lists a Target Retail Mega; its description agrees with Target and describes eight Prizms including six Disco. No exact barcode bridge was observed on that page.
- No direct Meijer product record was established. Do not attach Meijer to either product based on the user's general recollection.
- Waxstat aggregates several Mega UPCs on one product page, including both above. That page cannot establish their equivalence.

## Packaging evidence for existing UPC 746134202520

Collectors Emporium gallery image 3 was visually read in the browser. It lists Base Silver, Disco and RGB Mojo; numbered Base Purple Disco, Orange Disco, Fuchsia Disco, Red Disco, Gold Wave, Green Disco and Gold Power. It names Scorers Club, New Era, Connections, Aces, Phenomenon, Global Reach, Trophy Hunting and Screamers, with multiple Silver/Wave/numbered forms; exact per-family enumeration and per-player totals still require workbook extraction.

Other named inserts include Color Blast, Color Blast Duals, Prizmania, Color Wheel, National Landmarks, World Cup Posters, Team Badges, Manga, National Pride and Alter Ego.

Autograph families include Signatures, Penmanship, International Ink, Global Graphs, National Heroes, 2012 Prizm Throwback Signatures, **1994 Team USA Signatures**, Dual Signatures, Trio Signatures, Quad Signatures, Winning Captains and Signature Moments. Packaging advertises Wave and Gold Wave/Gold Power versions, with aggregate numbered ranges rather than per-card totals. The current pilot's default/Silver Team USA records do not establish those box-specific Wave variants.

These are research observations associated with a retailer gallery, not promoted canonical eligibility. No third-party image binary was downloaded or republished. Target's gallery encountered human verification before its reverse panel could be inspected; no challenge was attempted.

## Implementation sequence

1. Compare the printed contents of the two identified boxes. Justin notes they may share the same cards; do not require a product choice based on barcode differences alone. Group equivalent contents when supported and distinguish any exclusive parallel differences. Preserve all observed identities and existing evidence.
2. Extract exact packaging families for that box; compare manufacturer workbook rows and independent checklist identities. Preserve unresolved differences.
3. Prepare reviewed candidate variants and inclusion edges, without treating missing evidence as exclusions. Audit base/default semantics and existing personal flags.
4. Extend the guarded database importer for reviewed incremental changes with expected-current-digest protection, transaction rollback, no-op repeatability and unchanged existing IDs. Preserve the initial-import guard.
5. Back up; apply the reviewed change through PostgreSQL; approve and publish the new snapshot using the established workflow.
6. Make product browsing use the selected box's supported eligibility. Preserve release-level records and personal state without presenting unknown eligibility as box contents.
7. Run lint, typecheck, application and meaningful database tests, build, mobile checks; review, commit, push and verify deployment/remote parity.

## Completion status

Identity comparison and existing-box packaging reconnaissance complete. Target packaging, chosen-product full checklist, incremental import and public card-list correction remain incomplete. No application or database changes made in this research pass.

## Follow-up comparison

Justin questioned whether different retail Mega barcodes really imply different cards. They do not by themselves. [Collectosk](https://www.collectosk.com/2026-panini-prizm-fifa-world-cup-2026-soccer-cards/) reports Target/Excell-specific Teal Disco /149 and White Disco /20, compared with the NPP Disco colors above. Treat that as a secondary-source candidate difference pending exact packaging/manufacturer corroboration; do not assert the entire checklist differs. Retail Mega can remain the shopper-facing format, with version-specific eligibility where proven.
