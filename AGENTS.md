# BoxScout Agent Instructions

BoxScout is a mobile-first soccer-card sealed-product intelligence platform.

## Before doing any work

Read these files in order:

1. `docs/PRODUCT.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DATA_INTEGRITY.md`
4. `docs/DATA_MODEL.md`
5. `docs/UI_SPEC.md`
6. `docs/GOLDEN_PRODUCT.md`
7. `docs/ASTRA_RUNBOOK.md`
8. the current file in `docs/exec-plans/active/`

## Phase 1 objective

Build a V0 that Justin personally finds useful for evaluating soccer-card sealed products before buying them.

Do not optimize Phase 1 for monetization or scale.

## Hard rules

- Never invent card, checklist, configuration, pricing, odds, image, or surfaced-card data.
- Unknown is a valid value.
- Preserve provenance for factual data.
- Candidate data must never silently become verified canonical data.
- Keep canonical data separate from personal user state.
- Keep UI, domain logic, and data-access concerns separate.
- Do not introduce Supabase, authentication, payments, scraping, microservices, or unnecessary infrastructure during the first visible build.
- Do not expand Phase 1 scope without explicit approval.
- Prefer simple, understandable architecture.
- Build vertically around Golden Product #1 before adding more products.
- Make small changes, test them, then commit.
- Do not perform enormous rewrites unless explicitly requested.
- Never discard working behavior merely to “modernize” code.

## Required implementation loop

For any meaningful task:

1. Read the relevant docs and active execution plan.
2. Inspect the existing repository before editing.
3. If the task is ambiguous, ask only questions that materially affect implementation.
4. Create or update the execution plan before substantial coding.
5. Implement the smallest coherent vertical slice.
6. Run required checks.
7. Review the diff.
8. Fix regressions before finishing.
9. Summarize what changed in plain English.
10. Update project documentation if architecture or behavior changed.

## Verification

Once the project supports these commands, run them before completing coding tasks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

If a command does not yet exist, do not invent a passing result. State that it is unavailable and add the minimum appropriate setup when the active task calls for it.

## Active plan

Read:

`docs/exec-plans/active/002-verify-golden-product-configuration.md`
