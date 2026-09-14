# ADR 004 — Trust-First Monetization

## Status

Accepted by Justin on 2026-09-14 as strategy direction. Implementation requires a separately approved execution plan.

## Context

BoxScout helps collectors make sealed-card purchase decisions. Affiliate commissions and paid intelligence can fund the product, but incentives that alter factual analysis or recommendations would undermine its core value: trust.

## Decision

Monetization occurs downstream of trusted intelligence and must not influence factual analysis, rankings or recommendations. Revenue follows this order: free purchase intelligence → affiliate commerce → Pro demand validation → BoxScout Pro → retailer / B2B intelligence → API / data licensing.

Affiliate commerce is the first revenue experiment after useful public product coverage exists. Commission rate is never a ranking input. Retailer comparisons use evidence about delivered price, availability, freshness, reliability and geographic relevance, with uncertainty preserved. Affiliate relationships are disclosed near purchase links.

Core purchase information remains free and useful. Subscription billing waits until willingness to pay has been demonstrated. Candidate Pro features and tentative US$8–12/month pricing are hypotheses, not commitments. The full strategy is in [MONETIZATION.md](../MONETIZATION.md).

## Consequences

- Keep commercial relationships and attribution separate from catalogue facts and ranking logic.
- Apply the same data-integrity standards to free and paid intelligence; payment does not justify weaker evidence or false precision.
- Prohibit pay-to-rank, commission-influenced recommendations, a banner-ad-first strategy, early BoxScout-owned physical inventory, weakly supported EV/fair-value metrics, an intentionally crippled free tier, premature subscription billing and invasive tracking merely for monetization.
- Keep operating costs low until demand is proven; prefer deterministic processing and use AI only for meaningful value.
- Preserve the current Phase 1 scope. This decision adds no billing, affiliate redirects, tracking, accounts, B2B tools or API implementation.
