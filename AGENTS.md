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
8. `docs/MONETIZATION.md` and `docs/decisions/004-trust-first-monetization.md`
9. the current file in `docs/exec-plans/active/`

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
- Make small changes, test them, review, commit, push to GitHub and verify the remote.
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

`docs/exec-plans/active/006-persistent-backend-foundation.md`

## Monetization and cost principles

Follow `docs/MONETIZATION.md` and ADR 004. Monetization follows trusted purchase intelligence and must never influence factual analysis, rankings or recommendations. The sequence is free purchase intelligence, affiliate commerce, Pro demand validation, BoxScout Pro, retailer/B2B intelligence, then API/data licensing. Strategy documentation is not implementation approval; preserve Phase 1 scope.

Standing prohibitions: no pay-to-rank; no commission-influenced recommendations; no banner-ad-first strategy; no early BoxScout-owned physical inventory; no weakly supported EV/fair-value metric; no intentionally crippled free tier; no premature subscription billing; no invasive tracking merely for monetization. Disclose affiliate relationships near purchase links when implemented.

Keep runtime costs low until demand is proven. Prefer free/low-cost hosting, minimal paid infrastructure and deterministic processing before expensive AI. Use AI only where it adds meaningful value, and scale infrastructure costs with actual usage/revenue. Keep development subscriptions separate from application runtime costs.

## Definition of done — every execution plan and task

A task is not complete until all of the following are true:

1. Required checks pass.
2. The complete diff is reviewed and stays within approved scope.
3. Changes are committed locally in coherent commits.
4. The commits are pushed to GitHub.
5. The remote branch is verified to contain the latest commit; for work on main, local main and origin/main must match after fetching, with the live remote branch checked too.
6. The working tree is clean.

Local commits alone are not completion. GitHub is the canonical backup/history for code and documentation. If push or remote verification fails, report the blocker and do not claim completion or proceed to the next plan. For documentation-only tasks, verify document consistency, links, the diff and the absence of application changes; application checks remain required for coding tasks.

Standing Git rules:

- No force-pushing main.
- No rewriting shared history without explicit approval.
- Do not leave completed work only on the local PC.
- If the remote unexpectedly diverges, stop and investigate before changing history; do not overwrite remote work.
- Use coherent commits and report the pushed branch, commit SHA and synchronization status.
- Use the functioning Git for Windows executable at `C:\Program Files\Git\cmd\git.exe`; do not change system PATH or repair the unrelated devkitPro Git for this project.

## Separate backup responsibilities

- Code/documentation → GitHub.
- Future PostgreSQL/live data → database backups/exports.
- Future images/evidence assets → object-storage backup/versioning.

Pushing source code does not back up a future live database, object storage or browser-local personal state. Establish and verify the relevant data backup strategy when persistent services are introduced; this rule does not authorize adding those services now.

## Persistent catalogue foundation

Follow docs/PERSISTENCE_RUNBOOK.md for migrations, reviewed imports, publication, backups and recovery. PostgreSQL is canonical; the application consumes an approved versioned snapshot. Do not bypass publication review, overwrite a differing database or expose operator credentials. Current local-only backups are approved only for reproducible catalogue data; off-device scheduled backups are mandatory before irreplaceable data. No accounts or new data domains are authorized by this foundation.
