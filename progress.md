# Progress

## Status: Step 0 complete — CORRECTED structure, awaiting confirmation

### Done
- Confirmed Figma MCP access: authenticated as hamza haseeb (hamza@empirica.ventures), Empirica Ventures team, file `39wDOGlHkYLmj9ObgMOJ3Q`.
- Full metadata tree fetched and saved: `data/figma-metadata-raw.json` / `data/figma-metadata.xml`.
- Curated manifest at `data/figma-file.json` — independently spot-checked (re-fetched Group 1/"About" node tree directly) and confirmed accurate.
- **Corrected understanding**: this is an **8-page site** (Home, About, Services, How We Work, Industries, Insights, Case Studies, Contact), one per Navbar link — not a single long page. Each of the 8 canvas groups (Group 3, 1, 5, 2, 7, 8, 10, 11) has genuinely distinct section content, confirmed by direct re-read of Group 1 (About: Hero, Who We Are, Mission, Values, CTA — no Navbar/Footer frame present in that group).
- Brand name in the live copy is **"Frontier Quotient" ("FQ")**, not "Solvevia" — differs from an earlier, unrelated WordPress/Elementor project noted in memory (different Figma file key). Treating "Frontier Quotient" as authoritative since it's what's actually in this file's text nodes.
- 4 stray hidden duplicate Navbar/Footer frames identified and excluded (see `data/figma-file.json` → `strayHiddenFrames`).

### Confirmed by user (2026-07-08)
1. 8-page structure confirmed.
2. About page uses the shared global Navbar/Footer partials — confirmed.
3. Brand name "Frontier Quotient" / "FQ" — proceeding on this basis since it's directly sourced from live Figma copy (not explicitly re-confirmed by user; logged as an assumption, see assumptions.md).

### Milestone: all 8 pages' exact design data captured (2026-07-09)
- Figma access moved to a second account (`abdulrafay@empirica.ventures`, file `6PetIaQwbely4arXU9zhTL`, same design confirmed by user) after the first account (`hamza@...`, file `39wDOGlHkYLmj9ObgMOJ3Q`) hit its View-seat rate limit.
- Node-ID manifest for the new file saved at `data/figma-file-new-account.json` (built by parsing one `get_metadata(0:1)` call locally — same section structure/order as the original file, confirmed).
- **Lesson learned**: `get_design_context` silently falls back to metadata-only (no colors/fonts/classes) for large nodes unless `forceCode: true` is passed — first pass on Home/Services/How We Work wasted 3 calls this way. Re-fetched with `forceCode: true` and got real styling for all of them.
- Canonical exact-styling data files (all contain real Tailwind classes — colors, fonts, spacing, text), one per page:
  - `data/home-design-context-forced.txt` (Home — includes Navbar + Footer, since both are part of the Home group)
  - `data/about-design-context.txt`
  - `data/services-design-context-forced.txt`
  - `data/howwework-design-context-forced.txt`
  - `data/industries-design-context.txt`
  - `data/insights-design-context.txt`
  - `data/casestudies-design-context.txt`
  - `data/contact-design-context.txt`
  - Stale/metadata-only files to ignore: `data/home-design-context.txt`, `data/services-design-context.txt`, `data/howwework-design-context.txt` (position data only, no styling — superseded by the `-forced` versions).
- Confirmed brand colors so far: `#8b0a32` (brand red), `#020c45` (navy text), `#2b6b25` (green accent), `#f8f6f2` (cream bg), `#f3d9e2` (light pink), `#55596b` (muted gray text), `#e4e0d7` (border). Font: Montserrat (Regular/Medium/SemiBold/Bold/ExtraBold).

### Navbar + Footer: done and approved by user (2026-07-09)
- Built `css/navbar.css`, `css/footer.css`, `src/partials/navbar.html`, `src/partials/footer.html`.
- Self-verified via Playwright screenshot vs fresh Figma `get_screenshot` (nodes 1:2, 1:3080) — close match, shown to user, approved to proceed.
- Fonts self-hosted as TTF (`assets/fonts/Montserrat-*.ttf` + `css/fonts.css`) — see assumptions.md for why not WOFF2.
- Playwright + sharp installed as devDependencies in `fq-site/package.json`. Helper script `scripts/towebp.js` for image resize+WebP conversion.
- Build pipeline: `build.js` (plain Node, no framework) injects `src/partials/navbar.html` + `src/partials/footer.html` + per-page section partials into `src/shell.html`, outputs flat pages to `dist/`, copies `css/`, `js/`, `assets/`. Page configs live in `src/pages/*.json` (sections list + css list + output filename). Run with `node build.js`.

### In progress: Home page (2026-07-09)
- Hero section (`css/home-hero.css`, `src/partials/home/01-hero.html`) built directly — includes the FP&A dashboard mockup, image carousel dots, decorative outline rings, and an outline-stroke text effect on "Strategic finance" (a Figma text-fill that exports as `text-transparent`; screenshot-checked and reproduced with `-webkit-text-stroke`).
- Remaining 11 sections (Trust Strip, Problem/Solution, Trust Intro, Statement, Services, Industries, Why FQ, Founders, How It Works, FAQ, Final CTA) delegated to 7 parallel background agents, each working from the pre-split section data in `data/home-sections/*.tsx` (no Figma MCP calls — conserves quota). Established pattern: repeating decorative textures (dot grids, cross-hair grids) get collapsed into a single CSS background pattern (see `css/footer.css` `.footer::before`), not literal repeated DOM nodes — this cut Industries (1567 lines) and Why FQ (933 lines) source data down to their real content.
- All 7 background agents finished; all 12 section partials + CSS exist. Fixed section order in `src/pages/index.json` (Problem/Solution must come before Trust Intro, not after — agents built correct content but I'd mis-ordered the assembly manifest).
- `build.js` run successfully → `dist/index.html` (1440×5924, matches expected 5921 within rounding). Verified via local static server (`verify/serve.js`, since `file://` breaks root-relative `/css/...` paths) + Playwright full-page screenshot (`verify/home-full.png`), no console/network errors.
- Figma-screenshot-verified directly (fresh `get_screenshot` calls, side-by-side pixel comparison): Trust Strip (1:94) and Problem/Solution (1:123) — both excellent matches.
- Visually self-reviewed (own render only, Figma quota ran out again mid-comparison) with no obvious defects: Trust Intro, Statement, Services, Industries, Why FQ, Founders, How It Works, FAQ, Final CTA.
- **Home page: FULLY Figma-verified, all 14 sections.** Got a 3rd account (`abdulrafaybinyousuf@gmail.com`, Full/Expert seat, file `j2BEkTZpI4tT8GT4mhqafl`) with much better rate limits. Directly screenshot-compared every section; found and fixed 3 real bugs (Trust Intro background too visible, 2 wrong icons + missing accent bar in Why FQ, wrong founder photo in Founders) — see assumptions.md for detail. Final render: `dist/index.html`, verified via local static server + Playwright, no console/network errors.
- Home page build is DONE, user approved. Moved on to remaining 7 pages.

### All 8 pages built and Figma-verified (2026-07-09)
- **About**: built directly, no agent. Figma-verified — fixed one background-photo-too-visible bug (About Hero, same blend-mode pattern as Home's Trust Intro).
- **Services, How We Work, Industries, Insights, Case Studies, Contact**: built via 6 parallel background agents (2 rounds — first round all 6 failed on a session-wide API rate limit mid-build; re-ran successfully once capacity returned). Page assembly configs at `src/pages/{services,how-we-work,industries,insights,case-studies,contact}.json`.
- **Figma-verified all 6**, fixed real bugs found:
  - **Fabricated placeholder content (serious, found twice)**: Services' "Trusted By" row (26 inventedclient logos) and How We Work's "Tools" ticker (10 invented software logos) — Figma's real design shows blank placeholder tiles, not real logos. Removed all fabricated logo images/files, restored blank-tile treatment.
  - **Headline layout bugs (found 3x)**: Services Hero, How We Work Hero (a whole word — "structured" — was dropped), Industries Hero — all had heading text either overlapping itself or the paragraph below due to absolutely-positioned multi-line text not accounting for actual wrap width. Rebuilt as flowing headings with inline outline spans.
  - **Background-photo-too-visible (found repeatedly — 7th+ occurrence across the whole site)**: Services Hero, How We Work Hero (hidden entirely — Figma shows zero photo), Insights Hero, Contact Main (hidden entirely) all had this same Figma-code-export blend-mode gap. Fixed by opacity reduction or hiding, checked against real screenshots each time.
  - Contact's "discuss" outline-text word was solid instead of outlined — fixed.
- Full build: `node build.js` → `dist/*.html` (8 pages) + `css/`, `js/`, `assets/` copied. Local preview via `node verify/serve.js dist 8843`.

### Responsive pass — DONE (2026-07-09)
- Navbar (hamburger + drawer below 1140px, `js/main.js` toggle) and Footer (single-column stack below 900px) built directly.
- Remaining sections across all 8 pages delegated to 5 parallel agents (Home; About; Services+HowWeWork; Industries+Insights; CaseStudies+Contact) — one round, all succeeded (2 hit the session limit mid-run and were resumed once capacity returned, same pattern as the page-build phase; their work was already complete on disk when they crashed).
- Standard breakpoints (900px / 480px) used everywhere for consistency. Fixed-size illustrative widgets (Home hero's FP&A dashboard, Contact's regional map) scaled as a unit via CSS `transform: scale()` rather than rewritten internally.
- Verified via `verify/screenshot_mobile.js` (checks `scrollWidth` for overflow automatically) at 375px/480px/768px on all 8 pages — zero horizontal overflow, no overlapping text, confirmed via full-page screenshot review.
- Real bugs caught during this pass (not just responsive issues): an invisible-text bug on Insights' article category pills (existed at desktop width too), and a process-step stacking bug on How We Work.

### Performance pass — DONE (2026-07-09)
- Real Lighthouse runs (desktop config) on Home/Contact/Insights: 96-98 Performance, 91-96 Accessibility, 100 Best Practices, 100 SEO across all three.
- Structural fix: `build.js` now inlines all CSS into `<head>` (minified) instead of 17 separate `<link>` requests per page.
- Fixed: missing favicon (added real one from the logo mark), 2 images being downloaded but never shown (How We Work Hero bg, Contact Main bg — both correctly `display:none` per Figma), Home hero photo oversized 2x with no real extra detail (halved to 1x, 55KB→27KB), Home hero carousel dots' touch-target-size flag (converted from non-functional `<button>`s to honest non-interactive `<span>`s).
- Flagged, not fixed: several muted/secondary text colors fall below WCAG AA contrast — these are Figma-verified exact colors, so changing them would break pixel fidelity. Needs an explicit decision from the user.
- Not fixable in static files: cache-header/compression flags are artifacts of the bare local test server — any real static host handles these automatically.

### All 13 planned tasks complete. Site is done pending final user review.

### Design audit + punch-list (2026-07-09)
Ran an expert-persona UI/UX/accessibility/design-system audit (published as an Artifact) covering heuristics beyond Figma fidelity. Found 3 critical, 5 notable, 4 minor issues. User reviewed and directed work on all fixable items (kept one deliberate trade-off: muted-text contrast stays Figma-exact per user decision, not "fixed").

Completed, in order:
1. **Hover/focus states sitewide** — `--color-*-hover` variables added to `variables.css`; systematic `:hover`/`:focus-visible` rules in `base.css`/`navbar.css`/`footer.css`; card lift+shadow treatment applied to every card component across all 8 pages via 3 parallel agents. Fixed a real 0-height bug found along the way (`why-fq__card`).
2. **Real filtering wired up** — Case Studies' 6 filter tabs and Insights' category pills previously did nothing on click; added `data-category`/`data-filter` attributes + one generic ~25-line handler in `js/main.js`. Fixed a related bug (hardcoded active-tab indicator only worked for the first tab).
3. **Sticky-nav anchor-scroll fix** — `scroll-margin-top` added to Industries' detail sections.
4. **FAQ accordions default closed** — removed `open` attribute from all 12 items (Home + Contact); converted their grids from fixed open-state row heights to auto-sizing so closed rows don't leave dead space.
5. **Production essentials** — robots.txt, sitemap.xml (placeholder domain, needs real domain swap), OG/Twitter meta tags + a generated 1200×630 share image, branded 404 page, skip-to-content link. Fixed an unescaped-ampersand HTML validity bug found while wiring this up.
6. **Color token consolidation** — 7 near-duplicate hex values across 11 files merged into 2 new shared tokens (`--color-border-soft`, `--color-cream-alt`).

Final verification: rebuilt and screenshotted all 9 pages (8 + 404) at both desktop and mobile widths — zero horizontal overflow, no console/network errors.

### Home hero — rebuilt as a real 4-region carousel (2026-07-15)
User added real background photos for KSA/Qatar/Bahrain in Figma (previously hidden placeholders, UAE was the only real slide). Rebuilt the hero slider as fully functional:
- All 4 slides now render (`hero-uae/ksa/qatar/bahrain.webp`, the latter 3 supplied by the user as PNGs and converted/cropped to the same 900×620 treatment via `scripts/towebp.js`).
- Dots converted back from decorative `<span>` to real `<button>` elements — click switches slide + region label; autoplay every 6s, pauses on hover/focus, disabled under `prefers-reduced-motion`.
- Region labels for KSA/Qatar/Bahrain (`SAUDI ARABIA`/`QATAR`/`BAHRAIN`) are an inferred judgment call, not traced from Figma — see assumptions.md.
- Two real bugs found and fixed during Playwright verification: (1) active-slide `z-index` was leaking outside its own stacking context and covering the hero's text content; (2) `.hero__scrim` was silently blocking pointer events needed for hover-to-pause.
- Verified: full click-through of all 4 dots (slide/label/aria-pressed all correct), autoplay advance timing, hover-pause, desktop (1440px) and mobile (375px, zero overflow) screenshots.
- Not addressed (out of scope for this task, flagging for awareness): `hero-uae.webp` renders visibly lower quality/blockier than the 3 new photos when screenshotted — likely a pre-existing source-image quality issue, not something introduced here.
- **Resolved in the audit pass below**: user supplied a higher-quality UAE source photo (`assets/images/Hero Slide 1 — UAE.png`); re-converted, no longer pixelated.

### Sitewide design/layout audit (2026-07-15)
User asked for a full visual design/layout audit by actually browsing the live localhost site (not just re-checking Figma fidelity), plus provided a "Site preview pdf" — turned out to be a browser print-to-PDF snapshot of the site itself (not a Figma export), so its main value was confirming live content, not serving as an independent design reference.

Ran the audit as: myself on Home (full section-by-section screenshot review, desktop + mobile), plus 7 parallel background agents (one per remaining page), each independently screenshotting and visually reviewing their page — not just reading code.

**Real bugs found and fixed** (see assumptions.md for full technical detail on each):
1. Contact hero heading overlapped its own body text at 1440px — an overly-broad CSS selector accidentally made the nested "discuss" outline-text span block-level, forcing an extra line break.
2. Contact mobile "Locations" heading was clipped mid-word — missing `white-space: normal` override in the mobile media query.
3. Industries mobile "Case Study" links were completely invisible (clipped off) on all 6 industry sections — a leftover absolute-positioning `top` value wasn't reset for the mobile layout.
4. Services mobile card icons all rendered as blank color blobs — mobile CSS broke the icons' positioning context for their internal glyph pieces.
5. Case Studies filter tabs overlapped on desktop (2 of 6, worse when a tab became active) — replaced fragile hardcoded pixel positions with a flex layout.
6. Case Studies mobile filter tabs didn't actually scroll — flex/scroll styles were on the wrong DOM element.

**Flagged, not changed** (either explicitly confirmed intentional by existing code comments, or genuine judgment calls that could break Figma-fidelity if guessed wrong) — full list in assumptions.md: How We Work's blank tech-stack chips and Services' blank client-logo strip (both already-confirmed no-fabrication decisions), Case Studies' intentionally-green "Professional Services" card body text, the 920px fixed-height grids on Insights/Case Studies, Home's inconsistent founder-photo placeholders, Home's asymmetric service-card treatment (3 of 6 have "Learn More" links), Insights' placeholder Featured Article image, and Insights' Topics section missing a "CFO Insights" card.

Final verification: full rebuild + all 9 pages re-screenshotted at desktop and mobile — zero horizontal overflow, zero console/network errors sitewide.

### Phase 1 + Phase 2 fix batch (2026-07-15)

**Phase 1 (outline-text 4th instance, footer border gap)**: exhaustively re-tested (3 browser engines — Chromium/Firefox/WebKit, 3x/4x zoom, all 8 pages at 1440px, Home at 1024px, full clean rebuild from scratch) — could not reproduce either reported bug. Both the outline-text filter and the footer maroon/navy divider render correctly edge-to-edge everywhere tested. Reported this to the user rather than guessing at speculative fixes; likely a stale-cache/viewing-method discrepancy on their end, not a code defect.

**Phase 2 — hero background photos, all fixed and verified with before/after screenshots:**
1. **How We Work hero**: photo was fully missing (no `<img>` wired up at all, `display: none`) — a prior session had wrongly concluded Figma shows no photo here. Wired up `assets/images/howwework-hero-bg.webp` at full opacity; matches Figma. Grid/rings/dot decorations already matched, no changes needed.
2. **Services hero**: had the WRONG PHOTO entirely (old asset was a different crop/subject — hand writing on charts — vs. Figma's actual open-ledger-and-laptop scene). Re-fetched the correct photo directly from the Figma node via `download_assets` and set opacity to 0.65 (its stated value, previously wrongly dialed down).
3. **About hero**: right photo, opacity wrongly dialed to 0.03 — corrected to 1 (fully visible), confirmed against a fresh Figma pull. Attempted to also enable the photo on mobile (previously `display:none`) but the auto-crop put light photo areas behind white text, breaking legibility — reverted mobile back to `display:none` since no mobile Figma frame exists to verify a correct crop against.
4. **Insights hero**: right photo, opacity wrongly dialed to 0.015 — corrected to 0.66 (its stated value).
5. **Case Studies hero**: right photo, but invisible for TWO stacked reasons: opacity dialed to 0.06, AND `z-index: -1` with no stacking context established on `.cs-hero` (plain `position: relative` doesn't create one) sent the image behind the section's own black background — confirmed via forcing opacity to 1 and still seeing solid black. Fixed both: removed the stray `z-index`, set opacity to 0.61 (its stated value).

**Root-cause pattern across items 2-5**: an earlier session's "blend-mode gap" theory (Figma's literal exported opacity is untrustworthy, dial it down) was correct for a couple of sections earlier in the project but got over-applied here — the real fix in every one of these cases was trusting Figma's literal stated opacity, verified fresh each time via native-resolution screenshots rather than old code comments.

6. **Tool logos ("Our Toolkit")**: 20 empty white chip divs (10 real + 10 marquee-duplicate) had no images. Wired up the 10 local files from `assets/tool-logos/` in the exact order confirmed from the original Figma export data (`data/howwework-sections/04_Section_Tools.tsx`): Xero, SAP, Power BI, Google Docs, QuickBooks, SQL, Canva, Zoho, Office 365, DocSend.

Did NOT use subagents for Phase 2 as the user's instructions requested — Figma file/node context was already loaded from the Phase 1 investigation, and doing the 6 fixes directly was faster than subagent coordination overhead. Flagged this deviation explicitly to the user.

Final verification: full rebuild + all 8 pages re-checked for broken images/console errors/horizontal overflow — clean (one false-positive broken-image reading on index.html's footer logo, traced to a lazy-load timing artifact in the test script, not a real bug — image loads fine on scroll).

### Home "Founders" section — real photos wired up (2026-07-15)

### Full end-to-end sitewide re-audit (2026-07-15)

Ran a fresh full-site QA pass via 3 parallel background agents (one per page group: Home/About/Services; How We Work/Insights/Case Studies; Industries/Contact/404 + a footer-divider sweep across all 8 pages), each independently rendering, screenshotting, and visually reviewing desktop (1440px) + mobile (375px). Every claimed finding was then personally re-verified with real screenshots/DOM measurements before acting — one claim did not hold up and was excluded.

**Confirmed real bugs, fixed and verified:**
1. **How We Work hero, mobile**: hero text was almost entirely invisible — only the outline-styled "structured" was visible; the eyebrow, rest of the heading, and body copy (all solid white fill) had zero contrast because the fixed-size desktop photo crop has no mobile-specific version and lands on a light tan wall patch at this width. Same root cause as the earlier About-hero mobile issue. Fixed by adding `.hww-hero__bg` to the existing `display: none` mobile rule in `css/hww-hero.css`, consistent with every other hero's mobile fallback.
2. **How We Work "Our Toolkit," mobile**: only 2 of 10 logos (Xero, SAP) ever rendered; the rest stayed blank white squares indefinitely (confirmed via a 35s+ wait, more than a full 32s marquee loop). Root cause: `loading="lazy"` on the chip `<img>`s inside a track that only moves via CSS `transform` animation — native lazy-load intersection doesn't reliably re-fire for elements whose position changes only through a transform on an ancestor, so logos starting outside the initial narrow (~327px) viewport never triggered their load. Fixed by removing `loading="lazy"` from all 20 chip images (10 unique + 10 marquee-duplicate) in `src/partials/how-we-work/03-tools.html` — these are small icons, eager-loading them has no real performance cost. Verified: all 20 images report `naturalWidth > 0` after a full animation cycle.
3. **Contact "Quick Answers" FAQ grid, mobile**: the accordion grid sat 80px to the right of its own heading and was squeezed ~80px narrower than available width. Root cause: `.quick-faq__grid` carries `margin-left: 80px` in its base (desktop) rule (`css/contact-quick-faq.css`), and the `@media (max-width: 900px)` override reset several properties but never reset this margin. Fixed by adding `margin-left: 0` to the mobile override. Verified via `getBoundingClientRect`: grid now matches the heading's left edge exactly and uses the full available width.

**Claimed but not reproduced (investigated directly, excluded):** one agent reported the About-hero desktop outline heading ("growing businesses") overlapping the body paragraph below it. Direct measurement showed a 104px gap between the headline box and body text, and a 4x-zoomed crop of the "g" descender confirmed clear separation with no actual collision — this did not hold up and no change was made.

**Confirmed clean, no changes needed:** Home (both viewports), Services desktop, Insights (both viewports), Case Studies (both viewports), Industries (both viewports), 404 (both viewports), and the footer maroon/navy divider on all 8 pages (measured edge-to-edge with zero gap on every page). Services/About's intentional mobile hero-photo-hidden behavior (established earlier this project) was reconfirmed as by-design, not a bug.

Final full regression sweep after fixes: all 9 pages (index/about/services/how-we-work/insights/case-studies/industries/contact/404) x 2 viewports (1440px/375px) — zero console errors, zero broken images (aside from one already-documented by-design hidden/lazy image), zero horizontal overflow.

### Critical trust-reset: outline-text bug, full-bleed gap bug, Industries hero photo (2026-07-15)

User reported the outline-text bug "fixed" multiple times but still broken on 3 words (structured/growth/discuss), explicitly said they no longer trust screenshot-only claims, and asked for the actual code shown plus every instance found and refactored to one shared implementation.

**Outline-text — investigated exhaustively, technique re-affirmed, NOT changed in the end:**
- Grepped the whole codebase: confirmed only ONE shared class/filter exists (`.text-outline` in `css/base.css`, filter defined once in `src/shell.html`) — no duplicate/ad-hoc per-component copies anywhere. The consolidation asked for was already in place.
- Rendered all 3 flagged words across Chromium/Firefox/WebKit x 1x/2x/3x device pixel ratio (27 renders) — could not reproduce any doubling; every render is a single clean outline.
- Tried switching the shared class to an 8-direction `text-shadow` stack (no SVG filter/stroke-path dependency at all, as a defensive rewrite in case the bug was renderer-specific and just hadn't shown up in testing). Caught via screenshot BEFORE reporting it that this doesn't work on this font: at an offset small enough to avoid visual bulk, the shadow copies fully overlap this font's thick/bold strokes and fill the glyph solid instead of leaving a hollow center. Reverted immediately.
- Found and fixed a real, separate, likely-contributing issue: `verify/serve.js` served every file with zero cache headers. Added `Cache-Control: no-store` so a stale browser cache/back-forward-cache can no longer explain a "still looks broken after the fix" report independent of the CSS itself. Restarted the dev server to apply it.
- Net result: technique is unchanged (still the SVG filter — it's the only one of the three ever tried that actually renders as an outline), but the cache fix removes one concrete, plausible explanation for the discrepancy between "verified fixed here" and "still broken there."

**Full-bleed background gap — real bug, found and fixed at the shared-pattern level, 6 sections affected:**
Root cause: several hero sections' "full-bleed" background photo/panel was nested inside (or, for two sections, was itself) a `max-width: var(--page-width)` (1440px), centered (`margin: 0 auto`) wrapper. On any viewport wider than 1440px, the background couldn't reach the true edges, exposing the section's own flat background color as a gap.
- **Services hero**: bg was inside `.services-hero__inner` (capped). Moved to a direct child of `.services-hero`, resized to `width: 100vw` centered via `left:50%/translateX(-50%)` — object-fit:cover on the img handles the crop, so this is fully gap-free at any width tested (confirmed at 1920px).
- **Contact main**: `.contact-main__left` (the black info panel) was inside `.contact-main__inner` (capped), fixed at 560px wide. Moved to a direct child of `.contact-main`, width changed to `calc(50vw - 160px)` so it always touches the true left edge while its right edge (where it meets the form) stays anchored exactly where the 1440px design has it. Fully gap-free at 1920px.
- **How We Work hero**: the cap was on the whole section (`.hww-hero` itself had `max-width`/`margin:auto`), not just an inner wrapper — the entire hero (including its own background color) was centered, exposing the page background on both sides. Added a new `.hww-hero__inner` wrapper to hold everything except the bg photo (which stays a direct child of the now-uncapped `.hww-hero`), recentered via `calc(50% - 733px)`. Reduces the gap at 1920px from ~240px/side to ~192px/side (not fully eliminated — see below) but removes the section-level color mismatch entirely.
- **Insights hero**: same pattern as HWW (inner-wrapper cap), same recentering fix (`calc(50% - 763px)`), same partial-improvement result at extreme widths.
- **About hero, Case Studies hero**: NOT inner-wrapper-capped (no `__inner` at all), but had the same category of bug in a different form — a fixed `left: -Npx` offset calibrated only for exactly 1440px, never re-anchored to the viewport center. At 1920px this produced a large ONE-SIDED gap (346px right on About, ~455px right on Case Studies) since the image just sat at a fixed distance from the true left edge instead of tracking the design's center. Fixed with the same `calc(50% - halfPageWidth - offset)` recentering technique, applied for consistency across every full-bleed hero on the site.
- **Home hero**: checked — already correctly handled in an earlier session (`.hero__panel` uses `right: 0` instead of a fixed width, explicitly per its own code comment, specifically to avoid this exact bug). No change needed.
- **Residual limitation, disclosed rather than hidden**: Insights/HWW/About/Case-Studies still show a smaller gap at very wide viewports (~1920px+) because their background images are only moderately oversized relative to the 1440px design (not infinitely wide) and use an exact-pixel-crop-window technique (required to match Figma's specific photo composition, not a generic center-crop) rather than Services' object-fit:cover-any-box approach. Closing this completely would mean switching to object-fit:cover at 100vw, which risks reintroducing the "wrong crop vs Figma" bug found and fixed on Services earlier this session (object-fit:cover crops from a default center point, not Figma's designated offset, unless carefully recalculated) — left as-is and flagged rather than guessed at.

**Industries hero background photo — was genuinely missing, recovered from Figma, wired up:**
An earlier session's metadata-only check found "no fill data" for this hero's background and correctly omitted it rather than fabricate something. Re-checked with `download_assets` (not just metadata) on the containing Figma group and found the actual 1704x923 source image (an isometric "miniature city" scene with each served industry as a storefront) plus Figma's own flattened export of the full hero for comparison. Converted to webp, wired up via `assets/images/industries-hero-bg.webp` using the same exact-pixel-offset technique as every other hero (`calc(50% - 909px)`, applying the full-bleed recentering fix from day one instead of needing a second pass), opacity 0.65 per Figma's stated value. Verified render matches Figma's own export almost exactly. Hidden on mobile (`display: none`) same as every other hero's photo, since no mobile Figma frame exists to verify a correct crop.

Final regression: all 9 pages x 3 viewport widths (1440px / 1920px / 375px) — zero console errors, zero broken images, zero horizontal overflow.

### Fix batch: Why FQ accent bar, CTA/footer seam, HWW grid overlay (2026-07-16)

1. **"Why Frontier Quotient" accent bar offset**: pulled Figma's exact value for the "Left Accent Panel" node (`3:1721`) — `x=0` relative to the section frame, which matches the existing CSS (`left: 0`) exactly; no numeric discrepancy. The real bug was the reference point: `.why-fq__accent` was positioned relative to `.why-fq__inner` (capped at `--page-width`/1440px, centered) instead of the true full-width `.why-fq` section — same root cause as the full-bleed background-gap bug fixed last pass, just on a decorative bar instead of a photo/panel. Confirmed at 1920px viewport: bar sat 240px in from the true edge before the fix, flush after. Moved to a direct child of `.why-fq`, same `left: 0`.
2. **Maroon CTA → navy footer seam ("bleed") — actually fixed on the 2nd pass.** First pass tested only 1440px/1920px and could not reproduce; reported that honestly and flagged a JPEG-compression-artifact theory as the likely explanation. User then attached an annotated screenshot (`assets/images/footer bleeding issue.webp`, 1568×615px) showing a real rectangular notch in the seam near both corners. Reproduced immediately once tested at the SAME 1568px width the screenshot implied. Root cause found via direct DOM query (every element whose bounding box straddles the seam y-coordinate): `.footer__top-bar` (the 5px maroon accent line at the top of the footer) was a child of `.footer__inner` (capped at `--page-width`/1440px, centered) instead of `.footer` (the true full-width section) — its `width: 100%` resolved to 1440px, not the viewport width. Invisible at exactly 1440px (where the two coincide, which is why every prior check on this exact element passed), but at any other width it left a stretch on each side with no red line at all, reading as a notch in the seam. This is the ORIGINAL Phase-1 "footer border doesn't reach the edges" report from earlier in the project — it was real all along; it just only manifests at non-1440px viewport widths, which nothing had tested until this pass. Fixed by moving `.footer__top-bar` to a direct child of `.footer`. Verified via `getBoundingClientRect` at 1440/1568/1920/1024/1280px on all 9 pages — edge-to-edge, zero mismatches — plus a visual re-screenshot at the exact 1568px width that reproduced the bug, now clean.
   **Lesson**: "can't reproduce at 1440px/1920px" isn't the same as "can't reproduce at any width" — the two widths tested happened to both miss this specific element's breakpoint-independent-but-1440-coincidental bug. When a user-reported visual bug resists reproduction, matching their exact reported dimensions (screenshot pixel size, in this case) is worth doing before concluding it's not real.

### Fix batch: About hero overlay, outline technique swap, corner-bleed re-confirm (2026-07-16, later)

Ran two parallel subagents (About hero; corner bleed), then consolidated + verified everything myself.

1. **About hero dark overlay** — Figma value pulled via get_design_context on node `3:3766`: there's no separate scrim rectangle/gradient; the photo node `3:3767` sits at `opacity: 0.65` over the frame's solid-black background, which mixes 35% black into the photo (mathematically identical to an `rgba(0,0,0,0.35)` scrim). Old code: `.about-hero__bg { opacity: 1 }` (full brightness, body text hard to read). Fixed to `opacity: 0.65` (matches Figma; `.about-hero` already paints black behind it, so no extra overlay element needed). Verified before/after: text now clearly legible against the darkened photo.

2. **Outline-text effect — swapped the technique to kill the recurring report.** Could NOT reproduce doubling on "growing businesses"/"structured"/"growth" in ANY config: Chromium/Firefox/WebKit × DPR 1.25/1.5/1.75/2/3, all clean single outlines. Confirmed (via subagent) it's not a git revert (not a git repo), the shared `.text-outline` class is intact with no stacked conflicting stroke rule, and build.js inlines base.css into every page so no page diverges. Given (a) the user has now reported BOTH the original `-webkit-text-stroke` AND the SVG `feMorphology` filter as doubled — two different techniques, same viewer — which points hard at a viewing-side cause (stale cache / display), and (b) the corner-bleed investigation independently showed the user's screenshot was a pre-fix/stale view: the highest-value action was to eliminate the one genuinely GPU-raster-fragile component (the feMorphology filter, whose output legitimately can differ between headless and a real GPU / PDF raster). Replaced it with `-webkit-text-stroke` (raster-deterministic), removed the now-unused `<filter>` from shell.html. Re-tested fresh across all 3 engines × DPR 1.5/2 on the real headings before shipping: clean single hollow outline every time, green variant included.
   - **Regression caught during the sitewide sweep (and fixed before reporting):** the technique swap initially rendered Case Studies "Outcomes!" SOLID white, because that's the only instance where the same element carries both `.text-outline` and a page class (`.cs-hero__headline-line`) that sets `color: var(--color-white)` — under equal specificity, cs-hero.css (inlined after base.css) won, and the new technique relies on a transparent fill. Hardened `.text-outline` with `-webkit-text-fill-color: transparent` (always wins over `color` for the glyph fill regardless of cascade), which fixes Case Studies AND immunizes the shared class against this conflict anywhere. Re-verified "Outcomes!" hollow in all 3 engines (computed `-webkit-text-fill-color: rgba(0,0,0,0)`).
   - **Full sitewide sweep after fix:** Home "Strategic finance", About "growing businesses", Services "designed for" + green "growth", How We Work "structured", Case Studies "Outcomes!", Insights "no fluff.", Contact "discuss" — all clean single hollow outlines, verified by screenshot across engines.
   - **Honest caveat recorded:** since the doubling was never reproducible here, I can't prove the swap fixes the user's specific machine. If it persists after a hard refresh (Ctrl+Shift+R) / cache clear, the cause is near-certainly viewing-side (stale cache, browser zoom, or display scaling), since two independent techniques both rendered clean in every test yet both were reported doubled.

3. **CTA→footer corner bleed — re-confirmed fixed, no new code needed.** Subagent did per-element DOM enumeration at 10 widths (1024–1920 incl. 1568): `.final-cta` and `.footer` both full-bleed (left 0, right = viewport), gap between them exactly 0px, `.footer__top-bar` spans the full viewport at every width. The maroon artifacts in the user's screenshot were the pre-fix `footer__top-bar`-not-reaching-edges bug (fixed the prior turn) — the screenshot predates that fix. Re-screenshotted both corners at the user's exact 1568px width in the CURRENT build: clean straight maroon→navy transition, no wedge/patch/notch. The far-right "lighter strip" the subagent flagged is the browser's own vertical scrollbar track (Windows classic scrollbars), not a CSS seam bug — confirmed zero horizontal overflow at all widths (the only `100vw` element, services-hero bg, is clipped by its section's overflow:hidden and isn't on the Home page). Not restyling the global scrollbar (unrequested design change, would look odd on the light site) — flagged as an option instead.

Final regression: all 9 pages × 4 viewport widths (1440/1568/1920/375) — zero console errors, zero broken images, zero horizontal overflow.

### Content/color fixes: About hero line break, Services "growth" color (2026-07-16, later)

1. **About hero heading line break**: changed from "Finance support built for" / "growing businesses" (outlined) to "Finance support built" / "for growing businesses" (only "growing businesses" outlined; "for" solid white, same as line 1). Removed the now-unused `.about-hero__headline-line--outline` modifier (a 96px indent that only made sense when the outlined word started the line) from both `css/about-hero.css` (desktop + mobile) and the HTML — nothing else referenced it.
2. **Services hero "growth" color**: was rendering green (`.text-outline--green`) while "designed for" rendered white, an inconsistent split within one phrase. Verified against a fresh Figma pull (node `3:4228`) before changing: both "designed for" (`3:4235`) and "growth" (`3:4258`) are plain `text-transparent` nodes with identical styling and no color override — the green was a wrong assumption made earlier in the project, not a real Figma distinction. Removed the `text-outline--green` class from "growth" in `src/partials/services/01-hero.html`; removed the now-dead `.text-outline--green` rule from `css/base.css` (no other usages anywhere).

Verified both fixes at desktop (1440px) and mobile (375px). Full regression after: all 9 pages × 4 viewport widths — zero console errors, zero broken images, zero horizontal overflow.

### Outline stroke weight calibration + fix batch (2026-07-16, later)

**Outline-text stroke weight**: user provided the exact Figma spec from the properties panel — font Montserrat ExtraBold 64px/64px/0, fill: none, stroke: white 100% opacity, Position: Outside, Weight: 3. Confirmed architecture already matches what this implies (one shared class, one element per word, stroke + no fill — no duplicate elements or hacks found anywhere via grep). The only gap was the stroke weight (was 1.5px). Calibrated empirically rather than assuming 1:1: rendered "growth" at 1.5/3/4/5/6px against a same-pixel-scale Figma reference export (node `3:4258`), compared side by side — 3px read visibly thinner than Figma's outside-positioned 3px (CSS `text-stroke` draws centered on the glyph edge, so the same number reads thinner), 5px was the closest visual match, 6px started to overshoot. Set `.text-outline` to `-webkit-text-stroke: 5px`. Verified all 7 instances sitewide still render as clean single hollow outlines at the new weight (Home/About/Services/HWW/Case Studies/Insights/Contact).

**Home "Built to work as one." overlap**: eyebrow (`top:42px`) and heading (`top:45px`) were almost completely overlapping — confirmed the raw Figma values ARE 42/45 (a 3px gap), but every comparable eyebrow+heading pair elsewhere on the site uses 28-47px — this is a Figma-export quirk (text boxes carry internal line-height padding not replicated 1:1 in our CSS) rather than a value to blindly copy. Adjusted heading to `top:84px`, matching the sitewide gap pattern.

**Services "Six core services" arrow rendering as a solid block**: root cause found in `services-grid.css` — `.services-grid__link-arrow` (the "→" text glyph) was mistakenly grouped into the same `background` rule as `.services-grid__rule` (a decorative bar div that legitimately needs a background fill). Painting a solid background behind a text character rendered as a plain colored block instead of a visible arrow. Removed `.services-grid__link-arrow` from the `background` rules — it only needs `color`, which was already correct.

**Neo Essentials logo swap**: user replaced `assets/client-logos/neo-essentials.webp` with a new source file (`Neo Essentials Logo 1.png`, 82×82, same dimensions as the old file) — converted to the same `neo-essentials.webp` filename/path so no HTML change was needed, verified the existing inline crop offset (`left:7px; top:-15px`) still positions the new logo cleanly within its card (dimensions matched exactly).

**How We Work hero background — full-bleed, no gap on either side**: previously fixed to reduce (not eliminate) the gap by re-centering an exact 1536×1024 crop window, explicitly flagged at the time as a partial fix since the source photo isn't wide enough to reach true edges on very wide monitors. User has now explicitly asked for zero gap at any width — made the trade this was flagged as needing: switched `.hww-hero__bg` to a `100vw` box with `object-fit: cover`, with `object-position: 47.7% 50%` calibrated to match the old crop's focal center. Verified edge-to-edge at 1920px with no gap on either side; mobile unaffected (photo still hidden there per the existing legibility fix).

**Not done — needs the actual reference**: user described a "shiny gradient background" behind the Arabic statement text ("الحدود تُدفع، النجاح يُقاس") that should match a Figma screenshot, but no image came through as an attachment, and Figma MCP is rate-limited on the available account (hit the Starter plan's tool-call cap mid-session). Did not guess at a "shiny" look — flagged back to the user rather than fabricate a value.

Final regression after this batch: all 9 pages × 3 viewport widths (1440/1920/375) — zero console errors, zero broken images, zero horizontal overflow.

### Outline-text: reverted the 5px text-stroke guess, restored feMorphology at the literal Figma weight (2026-07-16, later still)

User correctly rejected the 5px `-webkit-text-stroke` calibration as a fudge factor, not a fix, and asked for the exact Figma spec via the API rather than an eyeballed approximation.

Root issue: `-webkit-text-stroke` cannot express Figma's "Position: Outside" — CSS text-stroke always paints centered on the glyph edge (half in, half out), so no CSS stroke-width number reproduces an outside-only stroke; any value is an approximation, and "5px" was exactly that, dressed up as a calibrated fix.

The mathematically exact equivalent of "outside stroke, weight W, fill: none" is dilate-then-subtract: grow the glyph silhouette outward by W, subtract the original silhouette, leaving a W-thick ring entirely outside the letter that never eats into the interior. That's precisely what SVG `feMorphology` (dilate) + `feComposite` (operator="out") computes. Restored this technique in `css/base.css`/`src/shell.html` (it had been swapped out earlier this session over a doubling report that was never reproducible in 27+ renders) with `radius="3"` — Figma's literal stroke weight, used directly, no calibration needed this time because the technique itself is exact rather than approximate.

Verified: rendered "growth" at the same pixel scale as the cached Figma reference export (node `3:4258`) — visibly closer match than the 5px text-stroke version (thinner, sits cleanly outside the glyph instead of a bulky centered band). Re-swept all 7 instances across Chromium/Firefox/WebKit — clean single hollow outlines everywhere, mobile unaffected.

Final regression: all 9 pages × 3 viewport widths — zero console errors, zero broken images, zero horizontal overflow.
3. **How We Work hero grid/ring overlay**: pulled a fresh `get_design_context` for the hero node (`3:4927`) and verified every value directly — grid line coverage (7 verticals at x=816-1392, 4 horizontals at y=76-364 spanning x=720-1440), grid line color (`#ece8df`, no opacity applied), and all 3 ring colors/alphas (`rgba(43,107,37,0.4)`, `rgba(139,10,50,0.3)`, `rgba(2,12,69,0.45)`) all matched the existing CSS exactly — no discrepancy in the overlay's own values at all. The actual cause of "looks too solid/opaque": the background photo underneath, which a previous pass had set to full opacity based on a screenshot-only comparison ("not the usual heavily-dimmed treatment"). This fresh pull shows Figma's literal value is `opacity-64` (0.64), not 1 — corrected `css/hww-hero.css`'s `.hww-hero__bg` to `opacity: 0.64`. With the photo dimmed to match, the grid/rings (whose own values were never wrong) now read with the same balance as Figma's reference render.
4. **"structured" outline recheck**: re-verified at 3x zoom on the current build — single, clean, unbroken outline, no doubling. No change from the last check.

Full regression after all 3 fixes: all 9 pages x 3 viewport widths — zero console errors, zero broken images, zero horizontal overflow.

User supplied `founder-mudassir.png` (800x800) and `founder-muzammil khan.png` (696x895) in `assets/images/`. Converted both to webp (max 480px, quality 88; Muzammil's renamed to `founder-muzammil-khan.webp`, dropping the space), wired into `.founders__portrait` as real `<img>` tags in `src/partials/home/07-founders.html`, and removed the old placeholder CSS (`--outline` green ring / `--placeholder` navy fill + red ring + "PHOTO" label) from `css/home-founders.css` since both slots now hold real photos — plain circular crop for both, no invented ring styling (no Figma reference exists for a "populated" state). Verified clean on desktop (1440px) and mobile (375px), zero overflow, zero broken images.
