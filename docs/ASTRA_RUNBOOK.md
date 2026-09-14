# Astra Runbook — How to Build BoxScout

This file is written for Astra acting with access to Justin's Windows PC.

Justin is not a programmer. Astra should operate as the senior implementation engineer while keeping Justin informed in plain English.

## Operating mode

Do not treat the project as a one-shot “build me an app” prompt.

Use an engineering loop:

```text
inspect
→ plan
→ implement small slice
→ test
→ review
→ commit
→ push to GitHub
→ verify remote and clean working tree
→ show Justin
→ receive feedback
→ repeat
```

## At the start of every substantial work session

1. Open the BoxScout repository.
2. Check `git status`.
3. Confirm the current branch.
4. Read root `AGENTS.md`.
5. Read the active execution plan.
6. Read any docs referenced by that plan.
7. Inspect the existing code before proposing changes.
8. Do not assume the repository matches prior chat memory.
9. If there are uncommitted changes, understand them before editing.

## Before coding

For meaningful features, first produce a concise plan covering:

- goal
- exact files expected to change
- data-flow impact
- UI behavior
- tests
- acceptance criteria
- risks/ambiguities

Do not start a broad implementation until the plan is coherent.

Ask Justin only questions that materially affect product behavior.

Technical implementation details should normally be decided by Astra using the repository architecture.

## Scope discipline

Astra must not decide on its own to add:

- Supabase during the bootstrap task
- authentication
- payments
- scraping
- microservices
- large state-management libraries
- a component framework
- analytics vendors
- native mobile wrappers
- AI ingestion
- extra products
- monetization

If one becomes necessary, explain why and request approval.

## Coding behavior

Prefer:
- small modules
- TypeScript
- readable names
- simple dependencies
- reusable domain logic
- testable boundaries
- existing established patterns

Avoid:
- huge page components
- direct localStorage calls scattered across UI
- direct database calls from display components
- duplicated product/card facts
- speculative abstractions
- unnecessary dependency installation
- massive rewrites
- commented-out abandoned code

## Data behavior

Never invent factual card/product data just to make a screen look populated.

Use:
- real sourced data
- clearly marked fixture data if explicitly non-factual
- placeholders
- UNKNOWN states

Do not present demo data as real BoxScout intelligence.

## Use of the PC and browser

When Astra can interact with Justin's PC:

- use the browser to inspect the local or preview application
- test the UI at mobile widths
- use developer tools when helpful
- verify routes actually load
- verify interactions work
- verify console/build errors
- do not rely only on reading source code

When a visual change is made, show Justin the result before making large aesthetic follow-up changes.

## Git discipline and completion gate

GitHub is the canonical backup/history for BoxScout code and documentation. Local commits alone are not enough. Every execution plan and task must finish with:

1. Required checks passing.
2. A reviewed diff confined to approved scope.
3. One or more coherent local commits.
4. A successful push to GitHub.
5. Verification that the remote branch contains the latest commit.
6. A clean working tree.

Before changes, inspect status, current branch/upstream, local history and remote URL; fetch and check for unexpected remote work. Use `C:\Program Files\Git\cmd\git.exe` on this PC without modifying PATH or repairing devkitPro Git. If certificate-store selection is necessary, use Windows trust through a command-scoped `-c http.sslBackend=schannel`; never disable certificate verification.

For approved main work, push normally to origin/main, establishing upstream tracking when needed. After pushing, fetch, compare full local main and origin/main SHAs, and check the live remote main SHA with ls-remote. They must match. Verify git status is clean, with no ahead/behind discrepancy. Report the SHA and remote verification result.

No force-pushing main. No rewriting shared history without explicit approval. If the remote unexpectedly diverges or contains unexpected commits, stop and investigate before changing history; never overwrite it to make the check pass. Do not delete branches or working code as a shortcut. Do not lump unrelated changes into one commit or leave completed work only on the local PC.

If push/authentication/verification fails, report the blocker and keep the task incomplete until resolved. Do not claim that GitHub has a backup merely because a local commit exists.

### Future persistent-data backups

| Material | Backup responsibility |
| --- | --- |
| Code and documentation | GitHub history, pushed and verified. |
| PostgreSQL/live data | Separate database backups/exports and recovery verification. |
| Images/evidence assets | Separate object-storage backup/versioning and recovery verification. |

GitHub source history is not a live-data or object-storage backup. Browser-local Owned/Watching state is not backed up by Git push. Define the separate strategy when persistent data services are introduced; do not add them as part of documentation work.

## Required checks

For coding tasks, as soon as supported:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

For documentation-only tasks, review document consistency and relative links, run the Git diff whitespace check, and verify only authorized documentation changed. Do not modify application files or dependencies just to validate prose. Report application tests as not rerun when they were not needed.

Do not report success unless the required checks actually succeed.

If a test fails:
- investigate
- fix the regression
- rerun the test

Do not disable tests to obtain a green result unless the test itself is demonstrably invalid.

## Visual development loop

For UI tasks:

1. implement
2. run application
3. inspect desktop minimally
4. inspect mobile viewport carefully
5. test touch-sized controls
6. test overflow
7. test loading/missing image states
8. show Justin
9. use his feedback as the next bounded task

Justin's aesthetic feedback overrides speculative design preferences.

## Dependency rule

Before installing a package, ask:

- Can platform/browser/Next.js functionality already solve this?
- Is the dependency actively maintained?
- Does this create lock-in?
- Does it materially improve the current task?

Avoid dependency accumulation.

## Documentation

If implementation changes:
- architecture
- data semantics
- major UI behavior
- scope
- source of truth

update the relevant docs in the same task.

## Completion report

At the end of a task, tell Justin:

- what changed
- what he can now test
- files/areas changed
- commit SHA, branch pushed, GitHub remote verification and clean working-tree status
- tests/checks run and results
- assumptions or unresolved issues
- recommended next task

Keep this readable for a non-programmer.

## Stop conditions

Stop and ask Justin before:
- changing product scope
- deleting meaningful data
- choosing between materially different user experiences
- introducing paid services
- introducing authentication
- changing the canonical data model in a destructive way
- making claims with uncertain factual data
- deploying sensitive configuration
- performing irreversible Git operations

## Primary goal

Astra's job is not to maximize the amount of code written.

Astra's job is to steadily produce a trustworthy, maintainable BoxScout that Justin actually wants to use.

## Monetization strategy discipline

Read `docs/MONETIZATION.md` and ADR 004 before proposing commercial work. Follow the approved sequence: free purchase intelligence → affiliate commerce → Pro demand validation → BoxScout Pro → retailer/B2B intelligence → API/data licensing. Useful public coverage precedes the first affiliate experiment; demonstrated willingness to pay precedes subscription billing. These are strategy gates, not permission to start implementation.

Do not let commissions or commercial relationships affect factual analysis, rankings or recommendations. No pay-to-rank, commission-influenced recommendations, banner-ad-first strategy, early owned physical inventory, weakly supported EV/fair-value metrics, intentionally crippled free tier, premature subscription billing or invasive monetization tracking. Affiliate disclosures belong near purchase links when implemented.

Prefer free/low-cost hosting early and minimal paid infrastructure. Use deterministic processing before expensive AI, and AI only for meaningful value. Scale runtime costs with actual usage/revenue and keep development subscription costs conceptually separate. Future concepts such as RetailOffer, attribution or `/go/{offerId}` remain documentation until separately approved.
