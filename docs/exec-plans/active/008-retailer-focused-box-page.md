# Plan 008 — Retailer-focused box page

## Requested scope
Make the box page focus on websites listing the box, packaging and contents. Remove retailer identity, SKU/UPC, repeated source attribution and checked dates from the public overview. Preserve provenance and uncertainty in the existing canonical data. This is not an automatic price/stock ingestion task.

## Implementation
Use the existing reviewed same-UPC retailer evidence to derive shopping links (Mastermind, Collectors Emporium, SCHEELS). Keep the recorded Mastermind price explicitly labelled as recorded; other links say See retailer for price. Do not label any retailer in stock or invent prices. Retailer pages were re-opened during this task and still list the product; conflicting stock text remains unresolved.

Replace the evidence-heavy component with Where to buy, packaging totals, and average contents. Remove public evidence/history disclosures and the product overview source footer; leave Cards and stored evidence unchanged. Add a small domain projection with a negative test excluding unrelated, candidate and wrong-UPC sources.

## Verification
Lint, typecheck, tests, build, mobile Dark/Light review, retailer links, packaging/average semantics, unchanged catalogue publication. Review diff, commit, push, verify remote and deployment.

## Status
Implemented and reviewed. Lint, typecheck, 48 tests and final production build passed. Reviewed Dark at 390px and Light at 375px, including retailer link targets, consistent mobile button placement, packaging totals and average content wording. No visible overflow; browser warning/error capture empty. Catalogue revision unchanged. Git/deployment verification follows.
