# BoxScout Monetization Strategy

## Status and purpose

Approved strategy direction; not authorization to implement monetization. Phase 1 still prioritizes a useful, trustworthy product for Justin and does not require revenue. Any commercial implementation needs its own bounded, approved execution plan.

BoxScout should become the decision layer immediately before a sealed-card transaction:

```text
discover → understand → inspect cards → assess chase/upside → compare products → compare retailers → purchase
```

This describes the intended journey, not a claim that all these capabilities exist today. Factual analysis, rankings and recommendations must remain independent of revenue incentives. See [ADR 004](decisions/004-trust-first-monetization.md) and [data-integrity rules](DATA_INTEGRITY.md).

## Monetization sequence

1. **Free purchase intelligence:** establish useful, trusted public product coverage.
2. **Affiliate commerce:** run the first revenue experiment once that coverage is useful.
3. **Pro demand validation:** demonstrate willingness to pay for additional intelligence before building subscriptions.
4. **BoxScout Pro:** implement only after willingness-to-pay evidence and a separately approved plan.
5. **Retailer / B2B intelligence:** explore business demand after the consumer foundation is established.
6. **API / data licensing:** consider later, with reliable data and appropriate rights.

Each stage is a direction and decision gate, not a deadline or automatic authorization for the next stage.

## Affiliate commerce

Affiliate commerce should be the first revenue experiment once BoxScout has useful public product coverage. Future design should support these concepts without creating speculative infrastructure now:

| Concept | Intended responsibility |
| --- | --- |
| Retailer | Retailer identity, geography and evidence about reliability. |
| RetailOffer | A retailer's offer for an exact sealed product/configuration. |
| PriceObservation | A dated, sourced price and availability observation, with explicit currency and delivery-cost uncertainty. |
| AffiliateProgram / AffiliateRelationship | Commercial relationship and disclosure metadata, kept separate from factual analysis and ranking inputs. |
| Outbound click attribution | Minimal attribution needed to evaluate the experiment, without invasive tracking. |
| Redirect such as `/go/{offerId}` | A future mechanism for resolving an offer and recording an outbound click; no route is authorized by this document. |

Commission rate must never affect rankings or recommendations. Ranking should instead use delivered price, availability, freshness, retailer reliability and geographic relevance. Unknown shipping/tax costs must remain unknown; do not fabricate delivered totals or treat stale stock as current. Reliability and other ranking factors require defensible evidence.

Affiliate and non-affiliate offers should be evaluated by the same user-relevant criteria. Affiliate relationships must be clearly disclosed near purchase links. Commercial attribution must not change source confidence, configuration eligibility, chase/upside analysis, or factual conclusions.

## Free product and Pro

Keep the free product genuinely useful. Core information should remain free:

- basic product information;
- visual checklists;
- basic configuration information;
- basic current pricing, with observation dates and uncertainty;
- basic chase information;
- normal comparisons.

Candidate future Pro features:

- serial-by-serial finite-hit intelligence;
- historical sealed-price charts;
- price-drop alerts;
- restock alerts;
- chase alerts;
- watchlist notifications;
- advanced chase-depletion analytics;
- cloud-synced watchlists;
- advanced comparisons;
- richer historical sales intelligence;
- personalized purchase intelligence.

These are candidates, not a committed feature list or permission to build them. Validate willingness to pay before implementing subscription billing. Later validation may test a tentative price around **US$8–12/month**; this is not a committed price or a claim about market demand. Paid intelligence remains subject to the same evidence and uncertainty standards as free intelligence.

## Later retailer / B2B and data products

Possible later products include sealed-market pricing, inventory intelligence, demand data, chase-depletion intelligence, market monitoring and BoxScout API/data licensing. Validate demand and data rights before committing to them. Demand data must not become a justification for invasive tracking or selling personal watchlists.

## Standing prohibitions

- No pay-to-rank.
- No commission-influenced recommendations.
- No banner-ad-first strategy.
- No BoxScout-owned physical inventory during early stages.
- No weakly supported EV/fair-value metric.
- No intentionally crippled free tier.
- No premature subscription billing.
- No invasive tracking merely for monetization.

## Cost discipline

Remain inexpensive to operate until demand is proven. Prefer free/low-cost hosting early, minimal paid infrastructure, deterministic processing before expensive AI, and AI only where it adds meaningful value. Infrastructure costs should scale with actual usage/revenue, rather than anticipated scale.

Keep development subscription costs conceptually separate from application runtime costs. A development tool subscription does not determine what users cost to serve, and does not justify adding paid runtime services. No provider purchase, billing system, affiliate integration, tracking service or infrastructure change is authorized here.
