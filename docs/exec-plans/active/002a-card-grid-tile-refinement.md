# Card Grid Tile Refinement — Plan 003 prerequisite

Approved bounded task: make images/placeholders dominant, with independent Owned top-left and Watching top-right icon overlays. Show only number/name beneath each image. Preserve four mobile columns, stable IDs, collection v1 persistence, search and the 24-card dataset. No detail navigation, ingestion, imagery or product-intelligence changes.

Files: card-browser.tsx, globals.css, UI_SPEC.md, this execution note and a prerequisite note in Plan 003. Overlay buttons remain siblings of the image/body, not nested in a future detail link. Test native button labels, pressed states, keyboard use, nonoverlapping touch areas, both flags and refresh persistence.

Verify 375×812, 390×844 and desktop: dense four-column grid, number/name-only captions, intentional placeholders, overflow, search and console. Run lint, typecheck, tests and production build. Review diff, commit, push, verify remote and Vercel production. Stop; Plan 003 implementation remains unapproved.

Status: implementation and local verification complete. GitHub/Vercel confirmation is reported in the task completion report.

Verification: lint, typecheck, all 18 existing tests and build passed. Production build inspected at 375×812, 390×844 and 1280×900. Four columns at each size; scrollWidth equals clientWidth (360, 375 and 1265). Targets measured 39.5×44 at 375 and 44×44 on desktop, without overlap. Keyboard Space/Enter, independent flags, both flags, refresh persistence, search/no-results/reset and intentional placeholders passed. Only number/name appear beneath images. Browser warning/error log empty. Test flags restored. No real-device Safari test or acquired imagery; long captions wrap. No application data, storage keys, routes, dependencies or intelligence changed.
