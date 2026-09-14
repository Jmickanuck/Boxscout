# Approved implementation amendments

Justin approved implementation on 2026-09-14. This supersedes the original planning-only status and image-count acceptance below. Success is the reusable model, pipeline, validation, rendering and independent rights controls. Zero public images is acceptable. No new storage service/backend or bulk acquisition. Update canonical long-term product direction now. Use targeted verification and complete the GitHub/Vercel publication gates. The original proposal below remains research context, not an image quota.

# Execution Plan 004 — Card Image Asset Foundation

## Status, authority and scope

PROPOSED — research/planning only, checked 2026-09-14. Implementation requires Justin's explicit approval. Baseline: main at 989e8ac72d2ec3b3e5a15af805668cbb52c35524, clean and synchronized with origin/main after fetch. This task creates only this document; no application, fixture, dependency, route, permanent-policy or infrastructure changes and no image dataset downloads.

Goal: a reusable, rights-aware pipeline for accurate card imagery, proved with 25–50 approved Golden Product base-card fronts before considering all 500. Match verification and permission to publish are independent gates. Coverage is conditional on rights clearance, not a quota that permits weaker evidence.

Read project product/architecture/data-integrity/data-model/UI/Golden Product/runbook guidance, required monetization documents, the current theme plan, relevant Plan 003 ingestion direction and ADR 003. Preserve the modular monolith, Card → Variant → FiniteInstance boundaries, canonical mobile tile, dark-default/persistent Light theme, all 500 identities, search, routes and boxscout:collection:v1.

## Research findings and recommended source hierarchy

These are source options, not acquired assets or negotiated licenses. Links and terms were checked on 2026-09-14. A manufacturer's authority for identity does not automatically grant BoxScout publication rights. Recheck the applicable asset-specific terms before acquisition/publication; do not treat this plan as a legal clearance or assume an exception to copyright applies.

| Priority / source | Realistic use and current evidence | Publication decision |
| --- | --- | --- |
| 1. Panini official product/media material | The [official release article](https://blog.paniniamerica.net/panini-prizm-fifa-world-cup-2026-hits-the-net/) exposes promotional imagery for the exact release. Useful discovery/identity evidence, not proof of 500 final base scans. [Panini terms](https://www.paniniamerica.net/terms-conditions) do not establish a general BoxScout republication license in this review. | Prefer a written grant or asset-specific licensed media feed covering the intended use. Promotional mockups require separate identification and cannot be silently called final base scans. No approved 25–50-image pool established. |
| 2. Authorized distributor/retailer media or directly licensed photographer | Existing [GTS release page](https://gogts.net/2026-panini-prizm-fifa-world-cup-soccer-cards-checklist/) is an official-distributor lead for permission and manufacturer material. Its checklist authority is not an image license. A photographer/collector can grant rights they actually control. | Obtain permission scope and authority to sublicense, including underlying card art where necessary. A retailer's right to advertise inventory may not cover BoxScout's reusable catalogue. No license or price quote obtained. |
| 2. Clearly licensed open assets | [Wikimedia Commons licensing policy](https://commons.wikimedia.org/wiki/Commons:Licensing) offers a practical per-file license-review pattern. Check author, original source, license version, attribution, derivative/share-alike obligations and underlying work. | No exact Golden Product image set with a verified reusable license found. A freely licensed player portrait is not an image of the checklist card. Do not substitute it. |
| 3. Future user-submitted or BoxScout-created scans | Can give better exact physical-card evidence. Record contributor consent, photographer rights, original file provenance and terms version. | Owning the physical card or taking its photograph does not by itself clear underlying artwork/likeness rights. USER_SUBMITTED and OWNED_ASSET describe origin, not automatic permission. No submission feature now. |
| 4. TCDB, checklist pages, marketplaces | [TCDB exact set](https://www.tcdb.com/Checklist.cfm/sid/614170/2026-Panini-Prizm-FIFA-World-Cup) is a matching/reference lead. [TCDB terms](https://www.tcdb.com/TermsOfUse.cfm) grant limited personal/noncommercial access and require written consent for commercial exploitation. Contributor permission to TCDB is not permission to BoxScout. [eBay API terms](https://www.developer.ebay.com/join/api-license-agreement) govern API content use; an API is not a blanket license for permanent canonical scans. | URL and minimal factual observation by default; no mirroring, hotlinking, bulk capture or public image proxy. Any separately negotiated permitted use must be reviewed for caching, retention, attribution and deletion restrictions. |

For future soccer products, [Topps' policy page](https://www.topps.com/support/policy-pages) expressly directs card-image publication requests through its permissions process. That is a realistic manufacturer-permission route, but not a Panini license and not permission to add a Topps product. General stock licensing is not a substitute for exact scans: [Getty's license agreement](https://www.gettyimages.co.uk/eula) distinguishes editorial restrictions from commercial uses; exact-card coverage and suitable rights have not been established. No paid imagery procurement proposed.

### What may be retained and published

- Public: only verified exact matches with an explicit approved publication decision whose evidence covers web/CDN hosting, resizing/format conversion and required credit, territory, duration and intended prototype/commercial context. Display only approved derivatives; originals require separate justification.
- Internal: source URL, publisher, observed identity, checked date, match rationale, rights summary and discrepancy record. INTERNAL_REFERENCE is a handling policy, not a license to download/store a binary. Retain restricted files only when permitted and necessary, outside public assets, client bundles and GitHub.
- Unknown rights: keep a link/reference and an intentional placeholder. Do not hotlink to bypass the rights gate or assume attribution alone is sufficient. No copied complete pages or screenshots of copyrighted galleries in Git.
- Permission evidence: public-safe grant summary and evidence reference in the manifest; private correspondence/contracts in appropriately restricted storage, never a public client payload. Record owner, review date, scope, expiration/revocation terms and a follow-up contact reference without exposing private contact information.
- Withdrawal: mark asset blocked, remove primary selection and public derivatives, redeploy, invalidate optimizer/CDN caches and handle old deployment URLs. Long immutable caches and Git history make revocation harder. Only put binaries in Git if the grant permits repository redistribution and durable history; otherwise stop and agree a different storage approach. Do not rewrite shared history automatically.

## Current implementation and proposed model

Today Card.image is a single small object. displayableImage accepts VERIFIED plus PUBLIC_ALLOWED or OWNED_ASSET. CardImage already uses next/image, a fixed aspect-ratio container, lazy loading defaults and an intentional error placeholder. No real image is currently approved. Extend these boundaries; do not build a second card grid or put matching rules into React.

Proposed image metadata is a sidecar catalogue, joined by stable identity through a repository. Keep generated checklist facts independent of image coverage. Preserve the existing Card.image shape as a compatible public projection where useful; do not hand-edit the generated 500-row checklist.

| Record / boundary | Minimum proposed responsibility |
| --- | --- |
| ImageCandidate | Stable candidate ID, source ID, source page URL, candidate image URL when known, retrieved/observed date, claimed release/card/variant, side FRONT/BACK/UNKNOWN, media kind SCAN/PHOTO/MOCKUP, source locator and discrepancy IDs. Multiple candidates may point to one card. No download required to create a reference. |
| ImageMatchReview | Candidate ID, exact target (base card ID with explicit BASE scope, or future variant ID), state CANDIDATE/REVIEWED/VERIFIED/REJECTED, confidence UNKNOWN/LOW/MEDIUM/HIGH, reviewer/date, observed identifiers, rationale and evidence references. Confidence is not a calibrated probability and never substitutes for review. |
| ImageRightsReview | Candidate ID, origin category (official/licensed/contributor/own/reference), publication state UNKNOWN/INTERNAL_ONLY/PUBLIC_ALLOWED/BLOCKED, grant basis and evidence reference, reviewedBy/At, credit text/link, allowed transformations/use contexts, expiry where applicable. Unknown required scope blocks approval. Match and rights may change independently. |
| ApprovedImageAsset | Asset ID, candidate/review references, content hash, side, dimensions, MIME type, byte size, storage key/provider, derivative recipe/version and derivative widths/formats/hashes. Original retention location/reason is nullable and private. URLs are resolved from storage keys rather than used as canonical identity. |
| PrimaryImageSelection | One approved primary per exact target + side, explicit asset ID and selection review. Deterministic tie handling; conflicting primaries fail validation. Missing is an absence/result, not a fake asset. Front is the grid default; never substitute a back or a parallel silently. |
| PublicCardImage projection | Approved URL/srcset information, dimensions, alt text and required attribution reference only. No candidate history, restricted URLs, private grants or user identity passed to the browser. |

Base scope means the actual base treatment is verified, not merely that the player/number matches. A null variant must never mean “all parallels.” Future variant images reference the corresponding Variant; future finite-instance or sale evidence links to an asset through its own evidence record, without making a sale photo the universal canonical image. Do not add Variant, FiniteInstance, sale or account implementations now.

Publication predicate: VERIFIED exact match AND PUBLIC_ALLOWED valid rights review AND approved nonwithdrawn asset AND applicable unexpired scope AND safe existing derivative. OWNED_ASSET no longer bypasses rights review. Apply the gate before public files are produced and again before public projection; hiding a URL in the UI alone does not secure a public file.

## Reusable ingestion workflow

`source manifest → candidate references → exact matching → rights classification → review ledger → approved assets → reproducible derivatives → public projection`

1. A product-specific source adapter or manually reviewed input manifest supplies candidates. Shared normalization, validation, rights gating, asset naming and generation accept any release ID. Avoid a hardcoded Prizm downloader, general crawler, scheduled jobs or discovery on page requests.
2. Normalize IDs/text/URLs/dates deterministically; join existing canonical records. Record release/year/manufacturer/set/subset/card number/player/team, front/back and base/parallel indicators. OCR or visual similarity may propose a match later; neither auto-promotes it. Distinguish 2026 World Cup from 2025–26 Prizm FIFA, other releases, promos, digital cards and mockups.
3. Verify final card appearance and identifiers against credible reference(s). Use back number where available and front treatment; a correct name alone is insufficient. Preserve conflicting identity/parallel observations and block promotion. Hash equality detects duplicate files, not duplicate physical cards.
4. Review usage rights separately before copying. For the pilot, select approved base fronts spread through the 500 records so lazy-loading/search are exercised; include varied names and card appearances. Back-image relationships and duplicate candidates can be tested with synthetic test metadata without publishing unlicensed examples.
5. An explicit approved allowlist authorizes bounded downloads only. Validate HTTPS source hosts, redirects, content type, decoded dimensions, byte/pixel limits and output path containment; reject executable/SVG payloads and decompression bombs. No arbitrary URL optimizer or access to private network destinations. Strip EXIF/GPS from public derivatives; do not remove copyright watermarks or alter printed card identity. Do not AI-inpaint or recolor a parallel.
6. Generate deterministic manifest/output with pinned recipe/tool versions and hashes. Preserve an authorized working master only if needed for reproducibility or evidence, with separate retention/backup. Replay uses retained permitted input, not a new network fetch; if source retention is prohibited, document the restricted replay boundary and preserve output hashes. Never claim full byte reproducibility without the required input and toolchain.
7. Publish only approved assets; dry-run and --check must detect stale output. Keep review decisions append-only where practical. A manual manifest/review file is the first queue; no admin UI or database required. Later adapters/jobs can emit the same candidates and reviews.

## Storage and delivery recommendation

### Pilot: existing Vercel + Next.js, no new service

Use 25–50 suitably sized licensed masters (rough target <=150 KB each at about 800px wide after visual review) under public/card-images/<asset-id>-<hash>.webp, only when the grant permits repository distribution. This small 3.75–7.5 MB exception for approved assets fits the prototype; do not commit source galleries, private originals or a 500-image collection. Metadata remains in typed fixtures/manifests. This is not the long-term binary repository.

Reuse next/image with an accurate sizes value derived from actual CSS (current desktop 180px hint understates the approximately 242px tile). Retain object-fit: contain and the existing fixed 2.5:3.5 container. Restrict useful widths, e.g. 128/256/384/512/768; about 80–85 CSS pixels on mobile needs roughly 160–255 source pixels at DPR 2–3. Desktop may need 512/768. Keep WebP initially; test AVIF only if visual quality, encoding/cache cost and byte savings justify an additional format. Never load original multi-megabyte scans into the grid. [Next.js Image documentation](https://nextjs.org/docs/app/api-reference/components/image) covers sizes/srcset, lazy loading, formats and remotePatterns; use the installed version's supported configuration.

Default lazy loading and asynchronous decoding; do not preload 500 images. Measure the initial viewport before considering priority for a single actual LCP image. Lazy loading can request nearby offscreen images, so test a bounded initial request set rather than asserting only visible tiles load. Preserve existing overlay hit areas, focus and theme tokens; real bright/white imagery must not obscure inactive/active controls. Required credits belong in a compact page-level image-credit area if the license permits that placement; no metadata expansion beneath tiles. If a license demands incompatible per-image presentation, resolve that before using it.

[Vercel image pricing](https://vercel.com/docs/image-optimization/limits-and-pricing): Hobby includes 5K transformations, 300K cache read units and 100K write units monthly; units are not simply image views. Delivery also consumes transfer/requests. Limits can cause optimization errors, so preserve fallback. It remains personal/noncommercial only. Approximately 50 assets × 5 requested widths × 1 format is 250 cold variants, not guaranteed monthly usage; revalidation adds work. Recheck actual account usage before implementation. No tier change authorized.

### Later object storage

Prefer evaluating R2 Standard when binary churn, rights restrictions on Git storage, catalogue size or delivery traffic justify migration. [R2 public delivery guidance](https://developers.cloudflare.com/r2/buckets/public-buckets/) requires a production custom domain for cache features; r2.dev is rate-limited development delivery. This is extra setup, not a free production CDN switch today. Keep private source/evidence storage separate from public approved derivatives. Serve pre-generated responsive WebP/optional AVIF directly through the object CDN to avoid routing all bytes through Vercel. A small loader/URL resolver keeps provider specifics outside domain logic. R2 itself does not transform images; Workers/Cloudflare Images are separate metered products and not proposed now.

[Supabase Storage pricing](https://supabase.com/pricing) is sensible later if Supabase is already needed: Free includes 1 GB files, 5 GB uncached and 5 GB cached egress; Pro starts at US$25/month with 100 GB files and 250 GB in each egress category, then US$0.0213/GB storage, US$0.09/GB uncached or US$0.03/GB cached transfer. It is unnecessary to introduce a database for this pilot. Image transformations may have separate eligibility/pricing; no transformation allowance is assumed in estimates.

Metadata can later move to PostgreSQL through repositories; never put image blobs there. At object-storage introduction, require an independent inventory/hash manifest, separate recoverable backup/export, retention controls and a restore test. CDN cache is not backup. GitHub backs up metadata/code; licensed pilot binaries only where allowed. Future private assets require their own protected backups.

## Scale estimates — assumptions, not a quote

USD, decimal GB, one image means one side of one card, not a card with both sides. Illustrative standard corpus: 150 KB authorized working master plus 100 KB combined responsive derivatives = 250 KB/image. Optional 2 MB original adds 2 MB/image. Assume 100 delivered thumbnail requests/image/month at 30 KB each, before browser caching, and one origin read per request as a conservative operation illustration. Real usage depends on visits, scroll depth, devices and caching, not catalogue size alone. Front+back doubles these figures; variants/candidates multiply them. Licensing, labor, tax, domains, backups, transformation compute and application hosting are excluded.

| Image count | Master + derivatives | Including optional originals | Monthly thumbnail requests | Thumbnail transfer | R2 Standard storage estimate after 10 GB free (without / with originals) |
| --- | --- | --- | --- | --- | --- |
| 500 | 0.125 GB | 1.125 GB | 50,000 | 1.5 GB | $0 / $0 |
| 10,000 | 2.5 GB | 22.5 GB | 1,000,000 | 30 GB | $0 / about $0.20 |
| 100,000 | 25 GB | 225 GB | 10,000,000 | 300 GB | about $0.23 / $3.23 |

[R2 rates](https://developers.cloudflare.com/r2/pricing/): Standard $0.015/GB-month, first 10 GB free; 1M Class A writes and 10M Class B reads free monthly, then $4.50/M and $0.36/M; internet egress free. Estimates apply provider rounding. Above request scenarios fit read allowance if no other reads; retries/HEADs and other workloads count. A six-object/image initial import fits 1M writes at 100K images; repeated generation may not. At 100M origin reads/month, extra reads alone are $32.40. Free egress is not free unlimited operations.

Supabase under the same assumptions: 500 derivatives/masters and 1.5 GB transfer could fit Free; optional originals exceed its 1 GB file allowance. 10K needs about $25/month Pro if a new project is required; 100K without originals about $26.50–$29.50/month if all 300 GB is respectively cached or uncached transfer (separate quotas), before other usage. With originals, add about $2.66 storage. Mixed traffic changes this; no Supabase purchase proposed.

Vercel pilot marginal cost is expected $0 within existing personal Hobby allowances, not a promise. [Plan overview](https://vercel.com/docs/plans) includes 100 GB Fast Data Transfer for Hobby, shared with the app. The 300 GB scenario exceeds that allowance. Cold optimization variants also grow approximately with assets × widths × formats: 500 × 5 is 2,500; 10K × 5 is 50K; 100K × 5 is 500K if all are requested. Do not extrapolate the free pilot into a production-scale guarantee; compare direct pre-generated object delivery at that point.

## Bounded implementation proposal (requires approval)

1. Confirm permission for a target 25–50 genuine base fronts and retention/delivery model. If no cleared pool exists, report the shortfall and keep placeholders; do not silently substitute marketplace images. Contacting rights holders or buying a license requires separate authorization; none sent/purchased in planning.
2. Implement minimal reusable image manifest, review records, validation, generation and repository projection. Limit actual acquisition to the approved list. Use the current checklist importer pattern without changing its data scope.
3. Attach approved images to unchanged base IDs; render within current tiles. Add fallback recovery when the asset URL changes after a prior load failure. Prove missing, blocked, back-only and wrong-variant cases cannot display as a base front.
4. Validate on local and deployed app, then stop. No full 500 acquisition, new product, variants dataset, finite tracking, sales, accounts, Supabase, monetization, routes, Compare changes or large UI redesign.

## Expected implementation files (not changed by this planning task)

- src/types/images.ts (new), src/types/catalog.ts: image types/public projection compatibility.
- src/domain/catalog/images.ts: deterministic eligibility/primary selection; src/repositories/card-image-repository.ts (new) and catalog-repository.ts: sidecar join.
- data/imports/golden-product-images/{manifest,candidates,reviews}.json (new public-safe metadata only); src/data/fixtures/generated/golden-product-images.ts (new).
- scripts/images/{normalize,validate,generate}.ts (small reusable modules; exact split at implementation), product adapter only if needed; package.json for replay/check commands. Lockfile only if an explicitly justified image-processing dependency is required, not preapproved package accumulation.
- public/card-images/: only the small approved pilot assets, conditional on repository rights; no raw originals. next.config.ts: bounded optimizer widths/quality if necessary.
- src/components/cards/card-image.tsx: responsive sizing, error recovery and approved image data; Cards page only for required credits/accurate coverage copy. globals.css only for image readability/controls if measured necessary, preserving dimensions and theme tokens. CardBrowser hierarchy/search/collection behavior remains canonical.
- tests/images.test.ts (new), relevant existing image/domain tests; doc updates listed below after approval. Do not rewrite the generated base checklist or its 500 IDs.

## Permanent product-direction documentation proposal

This section records the requested already-approved long-term direction; it does not authorize implementation. Later update these permanent documents coherently rather than allowing future agents to infer that these capabilities are permanently forbidden by Phase 1 exclusions:

| Document | Proposed preservation of direction |
| --- | --- |
| docs/PRODUCT.md | Distinguish deferred Phase 1 scope from long-term accounts, variant-level collection ownership, recent sales/valuation history, collection value by box/set, finite surfaced tracking and verified 1/1 depletion. Describe sealed price + configuration hit structure + supported card/variant values + surfaced evidence + remaining publicly unobserved population + confidence as future risk/reward inputs, never a present EV score. |
| docs/DATA_MODEL.md | ImageCandidate/MatchReview/RightsReview/Asset/primary relationships; Card → Variant → FiniteInstance; separate account CollectionEntry referencing variant/instance, quantities/grade and ownership only when those features are approved. Sale observations and valuation history stay separate from catalogue identity and image identity. Collection value by product/set needs defensible membership, valuation dates and uncertainty. |
| docs/DATA_INTEGRITY.md | Explicit publication rights gate, withdrawal and retention; evidence reuse does not prove a distinct physical instance. A verified surfaced 1/1 is evidence of that card, not proof of universal depletion or that all other cards are still available. Preserve sale-versus-listing semantics and avoid counting repeat photos/listings twice. |
| docs/ARCHITECTURE.md | Reusable ingestion adapters → candidates → reviewed canonical output; image storage/delivery behind repositories, later jobs/queues and separate metadata/binary storage. No coupling of canonical images to user ownership or vendor APIs. |
| docs/UI_SPEC.md | Approved image rendering, responsive/lazy delivery, credit placement and fallback within canonical four-column dark/light tiles. Reconcile older 24–40 imagery target with the approved pilot target. |
| docs/GOLDEN_PRODUCT.md | Exact image coverage and rights evidence, remaining placeholders and unchanged configuration uncertainty after the pilot. |
| docs/ASTRA_RUNBOOK.md and AGENTS.md | Active-plan pointer, explicit rights-review acquisition gate and future asset backup/restore checks. Keep existing scope and GitHub completion rules. |
| docs/decisions/005-image-asset-rights-and-delivery.md (proposed) | Record the independent match/rights decision and limited pilot storage exception; explain object-store migration conditions. Existing ADR 004 remains monetization. |

Only Plan 004 is changed now. Permanent product-direction updates should accompany an explicitly approved documentation/implementation scope; do not turn this list into speculative fields or feature code.

## Tests, acceptance and completion gates for implementation

- Data tests: stable/unique candidate and asset IDs, existing target/release joins, explicit BASE vs variant scope, side/media-kind validation, complete dated provenance and reviewer decisions. No identity changes or collection-key changes; all 500 records remain ordered/verified and all legacy IDs remain compatible.
- Rights tests: independently exercise match and permission states, including VERIFIED+UNKNOWN, own/submitted+no grant, expired/withdrawn assets, forbidden transformations, private source URLs and conflicting primaries. None may leak into generated public assets or browser projection. Back-only/missing cases retain placeholders.
- Pipeline tests: deterministic replay/check output with allowed retained inputs and pinned recipe; hashes/dimensions/MIME/size, duplicate candidates and path/URL rejection, no network during replay, no unapproved files in public output. Test second product identity synthetically to prove shared logic is not Prizm-specific without adding a real product.
- Rendering tests: 25–50 approved real fronts, remaining intentional placeholders, correct card/side with no cropped-off identity, alt text, required credit; image load failure and replacement recover predictably. Rights clearance is mandatory; no claim of pilot completion at 25 images if any lacks permission. Full 500 acquisition requires a later plan.
- Mobile/desktop: Products → Overview → Cards, full dataset search, Owned/Watching independently and together, refresh, both themes, 375×812, 390×844 and desktop. Four columns, unchanged captions/hit areas, focus/contrast over bright and dark actual images, no horizontal overflow or console warnings/errors.
- Performance: record cold/warm network image request count/bytes/currentSrc at DPR 2–3; verify initial load does not request all available images and no grid request uses full-resolution originals. Proposed budget: mobile grid derivatives typically <=30 KB and <=384px, initial pilot image bytes <=300 KB unless measured near-viewport loading justifies an explicitly documented revision. Inspect fast scrolling, search/toggle latency and decoded memory; compare before/after on same throttling/device settings. Target image-caused CLS 0, overall CLS <=0.1 and no material search/toggle regression (target <=100 ms on the tested device). Report actual LCP and memory where tooling supports them; do not invent measurements. No pagination/virtualization absent demonstrated need.
- Run npm run lint, npm run typecheck, npm test, npm run build, checklist:check and proposed image replay/check command. Local and deployed smoke checks; review entire diff; coherent commit/push; fetch and live GitHub SHA equality; Vercel Ready for same SHA; clean tree; report limitations and stop.

## Unresolved evidence and approval gates

No approved exact 25–50 Golden Product image pool or permission grant has been secured. Official promotional material may be mockups, parallels or insufficient coverage. Third-party reference access does not settle copyright, privacy/publicity, derivative rights or long-term licensing. Commercial use may require renewed permission even when prototype use is allowed. Review this before future monetization.

Image sizes above are planning assumptions until real cleared samples are processed. Metadata stripping/format conversion may conflict with license conditions. Git-distributed assets and persistent optimization caches complicate revocation; if rights require rapid/private revocation, use a separately approved object-storage approach instead. No service signup, payment, domain, license outreach or binary acquisition happened in this task.

## Planning-task verification

Only this proposed plan is authorized for the planning commit. Review document consistency, source links and Git whitespace diff; verify no application changes. Application tests are not rerun for this prose-only task. Commit, push origin/main normally, fetch and compare local/tracking/live remote SHA, confirm clean tree, then stop for approval. Do not start implementation automatically.


## Implementation verification — 2026-09-14

The amended foundation is implemented with zero public images. One official promotional URL was screened as an unassigned reference, no exact card-target candidate was established and no third-party binary was retained. Candidate/review normalization, explicit match/rights/approval gates, primary selection, content-hashed WebP generation and an isolated public projection are reusable. Synthetic test pixels prove positive generation/replay and actual component responsive/lazy markup without being published as card data.

Targeted local browser checks passed at 375×812 and 390×844: 500 tiles, four columns (79px and 82.75px), no horizontal overflow, intentional placeholders, search for Messi/#500, independent flags and refresh persistence. Test flags restored. No console warnings/errors. There are no real image requests to measure; real-image loading, visual quality and long-scroll image memory remain unmeasured until rights-cleared assets exist.

Route payload baseline (local production HTTP HTML, including embedded React payload): before 1,213,588 bytes, gzip estimate 45,176; after 1,213,676 bytes, gzip estimate 45,230 (+54 compressed bytes). Eight referenced script resources total 597,074 bytes uncompressed / 184,850 bytes independently gzipped. These are transfer-size estimates, not measured browser transfer or timings. Public pilot image payload: 0 bytes. Existing search/toggle unit checks are sub-millisecond on this PC; no field INP/LCP claim.

Required lint, typecheck, 38 tests, checklist:check and production build passed; image checks are part of prebuild. Full replay requires permitted local originals, while deployment validates approved public output without those private files. The same processor already used by Next.js is explicitly pinned as a development dependency. Canonical long-term direction and ADR 005 are updated; no future features are implemented. Final GitHub/Vercel verification is recorded in the completion report.
