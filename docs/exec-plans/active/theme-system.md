# Bounded task — Theme System

Approved by Justin after Plan 003. Dark is BoxScout's first-visit default, independent of system settings; Light is a persistent alternative. Preserve all catalogue, ingestion, collection, routes and card-grid behavior.

Implementation: convert existing color literals to shared semantic CSS tokens; add a compact header toggle; isolate versioned local preference storage behind a reusable repository. An inline head initializer applies the validated stored choice before body paint. Default CSS and server HTML are dark; no color animation or system-preference fallback. The root attribute alone may differ during hydration.

Expected files: globals.css, layout.tsx, a shared theme toggle, theme-preference repository, focused tests, UI_SPEC.md, this task record and AGENTS active-task pointer. No dependencies, data or card tile markup changes.

Acceptance: dark first visit; both toggle directions and reload persistence; readable text, focus, placeholders and independent active controls in both themes; existing 4-column mobile layout; no horizontal overflow or console warnings. Test Products, Overview, 500 Cards/search/collection at 375×812, 390×844 and desktop. Verify pre-paint initialization and storage-denied fallback. Run lint/typecheck/tests/build, review diff, commit/push/verify GitHub and Vercel same commit, clean tree, stop.

Limits: browser-local preference does not sync across origins/devices; future account storage can replace repository without mixing theme with canonical data or collection state. With unavailable storage, dark remains the load fallback and an unsaved user change is reported. No image ingestion follows this task.

## Implementation verification — 2026-09-14

- Shared semantic tokens now style both palettes; Dark is primary. No page/grid spacing, catalogue, routes, collection logic, search or ingestion changes.
- The header control names its current mode and action, supports keyboard activation and has a 44px minimum height. ThemePreferenceRepository isolates boxscout:theme:v1; local collection v1 remains separate. Same-origin tabs synchronize, and a new tab restores the saved mode.
- Inline initializer from each built route was inspected and executed against missing/Light/Dark/invalid storage: it is in head, before body, and selects the correct mode synchronously. Browser reloads retained both choices with no observed palette flash. No color transitions or system-theme lookup.
- Lint, typecheck, all 32 tests and production build passed. Theme tests cover missing/invalid values, persistence, collection isolation, storage denial/quota failure, pre-hydration bootstrap and palette contrast. Tested text pairs meet 4.5:1; tested focus/control boundaries meet 3:1. Light inactive icon border was strengthened to meet the threshold.
- Local production browser checks: Products, Overview and all 500 Cards in both palettes at 375×812, 390×844 and 1280×900. Four card columns and no horizontal overflow. Search (#500, Messi, no-match/reset), independent Owned/Watching, keyboard activation, saved flags across theme changes/refresh, focus outlines and placeholders passed. No console warnings/errors. Test collection flags restored afterward.
- Physical iPhone/Safari hardware and assistive technology were not available for this check; viewport emulation, DOM accessibility labels, keyboard behavior and deterministic contrast checks were used. JavaScript is required for changing mode; storage restrictions prevent future-visit persistence and are reported visibly.

Final publication gate: reviewed diff, coherent commit, normal main push, matching live GitHub SHA, Vercel Ready for the same commit, deployed smoke tests and clean working tree. Record publication SHA/status in the completion report. Stop after this theme task.
