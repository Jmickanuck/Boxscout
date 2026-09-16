# BoxScout Marketplace Data Strategy

Research checked: 2026-09-15.
Status: approved product intent; proposed implementation approach and researched source constraints. No provider, paid service, production access or ingestion implementation is approved by this document.

Read for card-market, sale-evidence, source-access or Plan 014/015 work, not as mandatory startup context. Plan 010 remains the only active execution plan. See [PRODUCT.md](PRODUCT.md), [MASTER_PLAN.md](MASTER_PLAN.md) decisions D05/D06, and [DATA_INTEGRITY.md](DATA_INTEGRITY.md).

## Product intent — D06

Justin explicitly envisions card pages showing eBay or other popular card-marketplace information to help establish prices and see what sold. This makes marketplace-backed card information an explicit requirement, rather than an unspecified future valuation feature. eBay is the first source to investigate, not an exclusive dependency or a confirmed integration.

Keep three outputs separate: **recent matching sales**, **currently observed listings**, and **any derived estimate**. Display supported information on the exact variant's detail view. Preserve the approved compact four-column gallery; this decision does not authorize adding price/history blocks beneath every tile or changing its layout.

## Source feasibility findings

These are documentation findings, not tests using BoxScout credentials. Recheck before implementation; visibility on a website is not proof of permitted automated access or reuse.

| Source | Potential role | Verified limitation / unresolved question |
| --- | --- | --- |
| eBay Browse | Listing discovery and purchase links | Listing search is documented [S1]. It is not a general sold-history feed. Production approval must be checked for the proposed use [S4]. |
| eBay Product Research | Manual comparable-sale research | eBay documents three years of results and actual accepted Best Offer prices, versus the shorter ordinary completed-listings window [S2]. This does not establish a public integration API or a bulk-republication license. |
| eBay Marketplace Insights | Historical sales integration, if access becomes available | Official documentation says restricted and not open to new users [S3]. Do not make delivery depend on obtaining it. |
| Card Ladder | Research/corroboration or a separately negotiated data relationship | Its product aggregates multiple venues [S6]; standard terms restrict systematic database collection [S7]. A consumer subscription is not a BoxScout data license. |
| SportsCardsPro | Possible external price-guide reference | Its documented API/CSV supplies current condition/grade values, explicitly not historic prices or sales [S8]. It cannot by itself populate a transaction history. |
| CardSight | Candidate developer data supplier to evaluate, not selected | It advertises commercial app use and source-linked data [S9], but the reviewed pricing page does not establish soccer coverage. Its historical endpoint mixes auction outcomes and Buy-It-Now asking prices. Verify soccer/Golden Product coverage, semantics, matching and rights with a sample before relying on it. |

Fanatics Collect, Goldin, Heritage and other venues can be evaluated for relevant original sale records; their inclusion in another service's database does not establish BoxScout's access or redistribution rights. Avoid counting the same underlying transaction twice when supplied by multiple aggregators.

## Integration and ownership gates

Before committing to a source, establish production access, exact soccer coverage, identifiers, actual sale-price semantics, cost, refresh limits, attribution, storage/retention, public display, images, derived analytics, AI processing and redistribution rights. API access alone does not settle all of these.

In particular, eBay's API agreement contains specific written-consent requirements and restrictions for pricing uses, restricted-API data, AI processing and bulk distribution [S5]. Resolve the proposed BoxScout use with the provider and appropriate agreement review before implementation. Do not send restricted payloads to an AI service merely because the coding workflow uses AI. A third-party scraper/API advertisement does not establish upstream rights.

**Architecture implication:** do not put licensed sale payloads, restricted history or marketplace photos into the public Git catalogue by default. First check that permitted storage and publication match the provider contract. Keep core catalogue browsing on the existing approved snapshot; any differently governed market-data cache/publication path needs its own bounded design. Do not rewrite the backend now. BoxScout's independently maintained identities and research remain distinguishable from revocable third-party data.

No account signup, provider outreach, purchase or source agreement has been performed by this research.

## Proposed comparable-sale contract

A marketplace result begins as an observation, not a canonical card identity or automatic VERIFIED price. Preserve:

- underlying venue, provider, listing/transaction identifier, source link, event date and retrieval date;
- exact release, subset, entry and parallel match with evidence; ambiguous records stay outside exact-match summaries;
- single card versus lot, sealed product, break spot, redemption, replica or another excluded item class;
- raw condition separately from grading company, card grade, autograph grade and certification identity;
- numbered edition total and serial ordinal when visible; special serials/patches are not silently treated as ordinary copies;
- original currency/amount, asking/current bid/accepted sale/unknown basis, and separately evidenced shipping, tax and buyer premium;
- source-reported sold status separately from payment/settlement confirmation, cancellation or later correction;
- eligibility for public display and analytics, independently from match confidence.

An ended or disappeared listing is not proof of a completed sale. A crossed-out asking price is not evidence of the accepted offer. Unknown amounts stay unknown. A source-reported sale should not be labelled independently payment-confirmed without supporting evidence.

Use underlying transaction identity to deduplicate provider reports. A later genuine resale is a new market event, but not a new surfaced physical card. Multi-quantity listings can contain several transactions; listing ID alone may be insufficient to deduplicate them. Retain finite-instance identity separately from transactions. Stock photos alone do not establish physical-instance uniqueness.

## Proposed card-page and analytics behaviour

The exact variant detail should support recent matching sales with dates/source links, separate current listings, raw/graded selection, and an optional historical chart once supported. Show sample count, covered date window, condition scope and last observation date. Explicitly distinguish no matches from source unavailable or coverage not established.

Start with inspectable comparable-sale evidence. A median and observed range can be proposed later only for a sufficiently comparable, recent, reviewed sample and permitted use; this is not a guaranteed sale price or a statistical confidence interval. There is no approved universal sample threshold, time window or valuation formula yet. Retain reasons for exclusions; do not discard an expensive result merely because it is expensive.

For thinly traded variants, show the few supported records or **insufficient sales evidence**, rather than inventing a value. Related variants can appear as separately labelled context, not be silently merged into exact comps. Keep provider estimates distinct from BoxScout calculations and underlying transactions.

Proposed default for box-opening context: raw/ungraded sales. Graded-card sales remain accessible but must not silently represent the value of a newly pulled card. Buyer sale prices are not seller net proceeds; fees, grading expenses and sale uncertainty need separate treatment before any return model. No expected value follows simply from adding up chase prices.

One valid listing may support both market research and a surfaced-card candidate, but each claim needs its own evidence review and permitted use. Preserve global finite-copy counts and the US-first shopping contract.

## Execution dependency

Source feasibility is a prerequisite to detailed Plan 014 automation, not permission to start it during Plan 010. Proposed first market-data pilot: a small representative set of Golden Product variants, testing exact matches, raw/graded separation, accepted-offer ambiguity, duplicate provider records, sparse history and unsupported sources. Report coverage, false matches, cost and review workload before expanding.

Plan 013 may need the same source-access/rights checks for listing-based sightings. Plan 015 must consume only supported, permitted observations; access to listing data alone does not justify valuation or surfaced-adjusted probability. No service availability, latency, price accuracy or complete-market coverage is promised here.

## Primary references

All checked 2026-09-15; provider claims are not independently audited data quality.

- [S1 — eBay Browse](https://developer.ebay.com/develop/api/buy/browse_api)
- [S2 — eBay Product Research](https://www.ebay.com/help/selling/selling-tools/product-research?id=4853)
- [S3 — eBay marketplace support / Marketplace Insights restriction](https://developer.ebay.com/api-docs/buy/static/ref-marketplace-supported.html)
- [S4 — eBay production requirements](https://developer.ebay.com/api-docs/buy/static/buy-requirements.html)
- [S5 — eBay API License Agreement, especially sections 8–9](https://developer.ebay.com/join/api-license-agreement)
- [S6 — Card Ladder product](https://www.cardladder.com/)
- [S7 — Card Ladder terms](https://www.cardladder.com/terms)
- [S8 — SportsCardsPro API/CSV documentation](https://www.sportscardspro.com/api-documentation)
- [S9 — CardSight pricing-data product and coverage description](https://cardsight.ai/solutions/price-data)
