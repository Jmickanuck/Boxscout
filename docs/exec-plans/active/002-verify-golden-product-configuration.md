# Execution Plan 002 — Verify Golden Product Configuration

## Status and authorization

PROPOSED — awaiting Justin's explicit implementation approval.

Research and this proposal are authorized. Do not modify application code or promote the proposed observations into application fixtures until approval. Justin accepted Plan 001 as complete. This plan does not reopen or expand that bootstrap.

Repository inspected on 2026-09-14: main at 8bc0794, clean before this proposal; documentation baseline 45197ff. Use C:\Program Files\Git\cmd\git.exe explicitly; do not alter PATH. The local origin/main tracking reference is missing; remote synchronization is outside this task.

## Goal

Show trustworthy configuration intelligence for the exact Mastermind 2026 Panini Prizm FIFA World Cup Mega Box: distinguish retailer identifiers, physical configuration identity, source-reported contents, and a dated CAD listing-price observation. Preserve uncertainty wherever the source chain stops.

Success does not require forcing NPP status to VERIFIED. A well-supported PROBABLE assessment with explicit gaps is a valid outcome. UNKNOWN remains valid if corroborating evidence fails revalidation.

## Scope

- One existing Golden Product, current routes and typed local fixtures.
- Bounded manual verification of the named retailer listing and a few relevant manufacturer/distributor or matching-UPC retailer sources.
- Retailer SKU, UPC, configuration assessment, pack/card counts, a small set of content claims, provenance, and Mastermind CAD price observations.
- Product Overview presentation; small shared-header/Products copy changes only where required to keep status language consistent.
- No Compare, Chases, Supabase, authentication, cloud sync, new products, full checklist ingestion, image acquisition, scraping framework, scheduled price checks, EV, odds inference or new dependencies.
- Do not contact retailers or manufacturers without separate authorization. Do not acquire or republish packaging/card imagery in this task.

## Research findings — checked 2026-09-14

### S1 — Exact Mastermind listing

[Mastermind Toys product page](https://www.mastermindtoys.com/products/2026-panini-soccer-prizm-world-cup-mega-box)

The visible listing identifies MMT SKU 256877. A direct HTTP 200 retrieval of its public Product JSON-LD at 2026-09-14T20:20:41Z associates the same product with GTIN 746134202520, offer variant 41821202317445, price 119.99 and currency CAD. The offer is for the listed Mega Box. Product JSON-LD labels Grosnor Distribution Ajax Inc. as brand; do not overwrite the release manufacturer Panini with this distributor-labelled value.

The retrieved page representations disagree about stock: extracted text includes sold-out and in-stock messages; JSON-LD reports InStock. Record availability as UNKNOWN/conflicting for now. The displayed amount is a listing-price observation, not a sale, market valuation or guaranteed purchasable offer. Shipping is calculated at checkout; tax inclusion is not established by the inspected product data.

SKU and GTIN observations are directly supported by the retailer. Neither independently proves the manufacturer's NPP configuration assignment. No precise content quantities or NPP label occur in the inspected description.

### S2 — Matching-UPC retailer corroboration

[SCHEELS product page](https://www.scheels.com/p/18467-2-20253-20mo20/74613420252)

The returned product data includes GTIN 746134202520. It specifies 6 packs, 7 cards per pack and 42 total cards. Its Prizm statement describes 8 Prizms including 6 Disco Prizms per box on average. Preserve inclusion: the six are part of eight, not six additional to eight. This is retailer corroboration for the matching UPC, not manufacturer verification or evidence about every Mega configuration. Do not import this source's non-CAD price.

### S3 — Explicit NPP description for the same UPC

[Collectors Emporium product page](https://collectorsemporium.com/en-ca/products/2026-panini-prizm-fifa-world-cup-trading-cards-mega-box)

The page explicitly lists UPC 746134202520 and describes an NPP/Retail Mega configuration. It states six packs of seven cards and gives per-box averages of one numbered Prizm, six additional Prizms, one Silver Prizm, one Silver insert, and five additional inserts/insert parallels. It mentions Red Disco /99. These are attributed retailer statements, not definitive manufacturer linkage. Retain the numbered parallel mention only as supporting mapping evidence; do not create chase or variant datasets. Its CAD storefront price is not needed for this bounded Mastermind-price task.

### S4 — Panini NPP sell sheet hosted by GTS

[Panini retail/NPP sell sheet, page 5](https://gogts.net/wp-content/uploads/2026/06/2026-Panini-Prizm-World-Cup-Soccer-Cards-Sell-Sheet-Retail.pdf)

The manufacturer-branded document identifies NPP Mega, six packs of seven cards, and a contents group headed “NPP MEGA BOX GUARANTEES”. That group lists one numbered Prizm, six other Prizms, one Silver, one Silver insert and five other inserts/insert parallels. It also associates Red Disco with NPP Mega. The document qualifies content as subject to change and does not supply a UPC linking this family to Mastermind's listing.

Its guarantee wording conflicts with the average wording in S2/S3. Store both source claims, including the sell sheet qualification, without rewriting either. Do not expose the sell sheet heading as an unconditional promise for this exact retailer box. Actual final-packaging wording has not been independently inspected in this task.

### S5 — Additional supporting retailer copy

[King Card Canada product page](https://kingcard.ca/products/2026-panini-prizm-fifa-world-cup-soccer-mega-box)

Page text includes the same UPC in image alternative text, describes six packs of seven cards and mentions Red Disco for NPP Mega. This is supporting evidence only: image alternative text and copied release marketing are weaker than explicit structured identifiers and a manufacturer product-code mapping. No images were downloaded or acquired.

### Research exclusions

A Waxstat result aggregates several UPCs under a Mega entry, including a malformed-length value. It is unsuitable for exact configuration identification. DICK'S search material contains relevant averages, but its direct page retrieval was unavailable; it is not required evidence for the proposed fixture. Do not treat repeated retailer marketing as independent manufacturer confirmation.

UPC 746134202520 passes the UPC-A check-digit calculation (expected and actual last digit: 0). This validates syntax only, not assignment, authenticity or configuration identity.

## Proposed evidence assessment

| Item | Proposed treatment |
| --- | --- |
| Mastermind SKU 256877 | VERIFIED observation that this is the retailer's SKU; scope is Mastermind listing only. |
| UPC 746134202520 | VERIFIED observation of Mastermind's reported GTIN, corroborated by matching-UPC retailers; display as retailer-reported UPC. Physical/manufacturer assignment still not independently confirmed. |
| NPP Mega mapping | PROBABLE, based on S1 identifier -> S3 same-UPC NPP description, supported by S2 and S4 contents. Not VERIFIED. |
| Six packs × seven cards; 42 total | Corroborated retailer-reported specification for the same UPC; proposed exact-box applicability PROBABLE. Derive 42 from the cited counts and retain direct S2/S3 support. |
| Content averages | REVIEWED source claims; exact-box applicability PROBABLE. Attribute to matching-UPC retailer, with nearby semantics-conflict disclosure. |
| Sell-sheet guarantees | REVIEWED source claims about NPP family, not verified guarantees for the Mastermind box. Preserve conflict with averages. |
| CAD 119.99 | VERIFIED observation of the Mastermind listing at the recorded time; availability UNKNOWN/conflicting. Recheck before implementation. |

State these as proposals, not already-applied fixture changes. Verification of what a source publishes is distinct from truth/eligibility of the underlying exact-box claim.

## Verification procedure during approved implementation

1. Recheck S1's title, SKU, GTIN, variant offer, currency, price and availability. Record actual observed time; do not reuse today's date for a later fetch. Keep today's researched observation if implemented as historical evidence, with its original timestamp.
2. Confirm the UPC syntax and exact identifier matches in S2/S3. Keep retailer SKU, UPC, variant ID and any manufacturer product code distinct. Preserve identifiers as strings, including leading zeros.
3. Make one focused attempt to locate a public Panini/Grosnor/GTS record explicitly joining this UPC or a linked manufacturer product code to NPP Mega. Do not expand into catalogue ingestion or image acquisition.
4. Assign VERIFIED mapping only with an explicit, reviewed manufacturer/distributor identifier bridge, no material conflict, and evidence linking that identifier to Mastermind's item. PROBABLE applies to the current corroborated retailer chain; UNKNOWN applies if it cannot be sustained. No numerical confidence scores.
5. Review content claims individually, including scope, quantities, units, grouping, qualifications and semantics. Keep disagreements, not a blended conclusion. Do not infer published odds, autograph guarantees or individual-card eligibility.
6. Persist a small reviewed fixture and show it through repository/domain boundaries. Finish when supported facts and remaining gaps are accurately represented; further evidence requests become a separate task.

## Proposed data-model changes

Extend the existing direction in DATA_MODEL.md, not a generic ingestion platform. Use readonly TypeScript types and small deterministic validators for manually transcribed fixture data. Keep current product, release, configuration and card IDs stable; leave Owned/Watching storage and all 24 card identities unchanged.

### Source observations and assessment

Retain existing Provenance fields. Add optional source/observation IDs, observedAt, source kind, locator (e.g. Product JSON-LD offers.priceCurrency or PDF page 5), brief source wording/notes, and qualification. Keep copied excerpts minimal. New configuration facts and claims reference provenance at field/claim level; a single product-wide VERIFIED flag cannot validate every field.

Use two distinct concepts:

- Evidence lifecycle: RAW/CANDIDATE/REVIEWED/VERIFIED — scoped to a named observation or claim.
- Identity/applicability assessment: UNKNOWN/PROBABLE/VERIFIED, with supporting observation IDs, explanation and unresolved conflicts. Do not infer this from lifecycle status.

The limited configuration fixture retains reviewed candidate family claims separately from accepted exact-listing observations. No automatic canonical promotion or overwrites.

### Retailer listing identity

Add a small RetailerListing record: id, productId, retailerName, listingUrl, variantOfferUrl/variantId, retailerSku, reportedUpc, and per-identifier provenance. Do not put retailer SKU 256877 into a field implying a Panini manufacturer SKU. Keep existing Configuration.sku null unless manufacturer identity is established; label/document its intended meaning before populating it.

Record NPP family assessment alongside the existing configuration with its status and evidence references. Current scalar pack/card counts must gain cited assessment metadata, or stay null while attributed candidate specifications are shown. Configuration.upc may be populated only with clear retailer-reported provenance and separate exact-configuration assessment; the UI must not mistake it for proof of NPP assignment.

### BoxContentClaim / specification observations

Add only what the few researched claims need: id, subject (exact listing or candidate NPP family), item/category, quantity or published odds, unit, claimSemantics, evidence references, applicability assessment, qualification, and conflict links. claimSemantics remains GUARANTEED / PER_BOX_AVERAGE / PUBLISHED_ODDS / POSSIBLE. Unknown semantics uses null and a reason, never an inferred guarantee.

Represent six packs/seven cards as packaging specifications rather than hit odds. Preserve SCHEELS' eight-including-six statement as a grouped claim; do not sum overlapping counts. Keep the five-item S3 average breakdown separate from the corresponding S4 guarantee claim. No metric calculations beyond the transparent 6 × 7 total.

### SealedPriceObservation

Add id, retailerListingId, productId, amountMinor (11999), currency CAD, observedAt, observationType LISTING_PRICE, sale unit ONE_SEALED_BOX, availability, tax/shipping inclusion states and provenance. Keep unknown tax treatment explicit; shipping amount is unknown and not included in an inferred delivered total. No currency conversion, sale-price inference, averages or ranking.

Store an append-only array: one genuine Mastermind observation is enough initially; append a second only if a separate recheck actually occurs. A source checked date and an observation time are not interchangeable. The domain selects the latest valid matching-listing CAD observation, excluding future-dated, invalid or candidate-price records. Label it last checked rather than live/currently purchasable. No invented historical series or silent replacement of earlier observations.

## Proposed Product Overview behavior

Reuse the established overview layout. Put price and identity first, followed by specifications, source-reported content claims and a concise evidence explanation.

- Price example: CAD $119.99 · Mastermind Toys · last checked 14 Sep 2026. Availability unconfirmed. Shipping calculated separately; tax treatment not verified. Always show source link and actual observation date.
- Separate identity rows: Mastermind SKU, retailer-reported UPC, and probable NPP mapping. Explain why mapping is probable and what would confirm it.
- Display 6 packs × 7 cards = 42 as matching-UPC retailer specifications with appropriate applicability qualification.
- Put average content claims under a clear retailer-reported/per-box-average label. Keep “on average” adjacent to quantities at mobile widths. Disclose that the NPP sell sheet uses stronger wording and the exact-box guarantee is unresolved; allow a compact native disclosure of both source claims.
- Do not turn POSSIBLE autograph content into an expected count. Do not label release cards as eligible Mega pulls.
- If evidence becomes unavailable, show last checked observations and their age/date; if there is no usable observation, show Unknown. Do not silently switch to another retailer or another Mega.
- Shared header/Products badge may say NPP mapping probable, but must not collapse a verified retailer SKU into a globally verified product.
- Preserve Cards/search/Owned/Watching behavior and image placeholders. No broad redesign or new routes.

## Expected files during approved implementation

Paths below are relative to C:\Users\Justin\Projects\Boxscout. This proposal itself is the only repository file created in the planning task.

| File | Intended change |
| --- | --- |
| src/types/catalog.ts | Listing identity, per-field assessments and small box-claim types; retain existing compatible types. |
| src/types/market.ts (new) | Small dated sealed-price observation type. |
| src/data/fixtures/golden-product.ts | Reference configuration intelligence while preserving stable IDs and card records. |
| src/data/fixtures/golden-product-configuration.ts (new) | Sourced listing observations, candidate family assessment, claims/conflicts and price observations. |
| src/repositories/catalog-repository.ts | Expose this product's configuration intelligence; keep fixtures out of UI. |
| src/domain/catalog/configuration-intelligence.ts (new) | Validate identifiers/claim scope and build qualified overview data. |
| src/domain/market/sealed-price.ts (new) | Validate/select dated CAD listing observations and format amounts without unsupported totals. |
| src/components/products/configuration-intelligence.tsx (new) | Focused presentation of identity, specs, claims, price and evidence. |
| src/app/products/[productSlug]/page.tsx | Replace unknown-only sections with repository/domain-backed presentation. |
| src/components/products/product-header.tsx | Consistent, qualified mapping badge. |
| src/app/page.tsx | Remove obsolete unknown-only copy where justified; no comparison or extra product. |
| src/app/globals.css | Only small additions for evidence rows/disclosures and mobile wrapping. |
| tests/configuration-intelligence.test.ts (new) | Identity, semantics/conflict and applicability tests. |
| tests/sealed-price.test.ts (new) | Price validation, selection, currency and date tests. |
| tests/boxscout.test.ts | Replace bootstrap-only assertions that required unknown identifiers with meaningful scoped-provenance checks; retain all persistence/search tests. |
| docs/DATA_MODEL.md, docs/GOLDEN_PRODUCT.md | Record implemented semantics and reviewed findings without overstating configuration certainty. |
| AGENTS.md | After approval, update active-plan pointer to Plan 002; keep existing rules. |
| README.md and this plan | Document behavior, actual evidence gaps and verification results. |

No package or lockfile change is expected. No changes to collection repositories/storage keys, card images or card identities. Do not move/archive Plan 001 as part of this task unless separately needed and authorized.

## Acceptance criteria

1. Exact Mastermind listing, retailer SKU and reported UPC have source-scoped provenance; UPC check digit is validated without claiming it proves identity.
2. NPP mapping displays VERIFIED/PROBABLE/UNKNOWN based on the documented evidence threshold, with rationale and gaps. Current evidence yields PROBABLE.
3. Every surfaced specification/content quantity has source, observation date, semantics where relevant and applicability status. Uncertain family claims never become unqualified exact-box facts.
4. Average and guarantee wording remain distinct; conflicts are visible. Grouped/included counts are not double-counted. No inferred odds, EV or autograph promises.
5. A real dated CAD Mastermind listing price appears with source/date/unit and unknown availability or costs where necessary; no claim of live pricing. A missing valid observation displays Unknown.
6. Evidence and price history are append-only fixture records; candidate facts remain separate. Stable catalogue/card IDs and Owned/Watching behavior survive unchanged.
7. Mobile overview remains readable at 375/390px with no overflow. Links/disclosures work, and status/date qualifiers stay visible near facts.
8. All required checks pass and the working diff stays within the listed scope. Justin sees the running result. No excluded features or images added.

## Verification/testing plan

- Unit tests: valid/invalid UPC including leading zeros; retailer SKU versus manufacturer code; explicit evidence thresholds; a VERIFIED source observation with only PROBABLE applicability cannot yield a VERIFIED mapping; no cross-configuration fallback.
- Claims: average remains average, possible remains possible, unknown semantics remains unknown, conflicting guarantee/average records both survive, counts containing subcounts do not add together, unknown configuration does not imply checklist eligibility.
- Prices: integer minor units; explicit CAD; actual date; same listing/one-box unit; retain history; latest eligible observation chosen independently of array order; wrong currency, invalid/future dates and candidate observations cannot become the headline; equal-time conflicts produce a qualification rather than arbitrary selection; no usable observation -> Unknown.
- Regression: existing independent toggles, persistence, search, image-rights tests and unknown-product behavior. Revise only tests whose bootstrap-specific unknown values have legitimately changed; never disable failing behavior tests.
- Run npm run lint, npm run typecheck, npm test and npm run build.
- Run production/local app. Inspect Products -> Overview -> Cards at 390x844 and 375x812 and a desktop width; check qualifier wrapping, currency/date/source links, disclosure, no overflow, console errors, search, independent flags and refresh persistence. Note viewport testing versus real Safari/device testing.
- Review full diff, record actual results, then make coherent commits. Stop after Plan 002; no automatic next task.

## Unresolved evidence gaps and completion boundary

- No authoritative manufacturer/distributor UPC-to-NPP bridge yet. Retailer corroboration can share copied errors.
- No independent inspection of final physical packaging/UPC or its precise average/guarantee disclaimer in this task; image acquisition remains excluded.
- Exact-box guarantee semantics remain disputed between source classes. The proposal deliberately does not resolve that conflict by guessing or by choosing stronger wording.
- Availability conflicts, tax treatment and delivered shipping cost are unresolved. Price is dated, not continuously updated.
- There is no evidence here to verify each checklist card or variant's Mega eligibility; keep existing eligibility unknown.

No new product decision is required to implement the conservative behavior above. Justin's approval of this plan authorizes implementation, not stronger factual claims or contacting third parties. If a material UX/scope decision arises, pause that decision and explain the concrete choice. Until explicit approval, leave application code unchanged.
