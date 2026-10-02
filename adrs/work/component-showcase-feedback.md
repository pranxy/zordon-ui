# Component and showcase improvements

> **Status:** Partial. Original showcase implementation delivered; T2 reproduction and T12 integrated environment/baseline gates remain open. T13 Table implementation is delivered and independently reviewed; WebKit, manual accessibility and additional Angular support lanes remain open.
> **Updated:** 2026-09-29
> **ADRs:** Existing platform, composition, styling, Modal and Accordion decisions apply. Accepted [Accordion exit timing](../../docs/architecture/0028-accordion-exit-animation.md) records the narrow policy change needed for the requested animation.

## Outcome and boundaries

Address the original 16 areas in the review: FAB, Dialog/Modal, Accordion, Avatar, Aura, Badge, Card, Carousel, Chat Bubble, Countdown, Diff, Hover 3D, Hover Gallery, List, Stat and Status. Follow-up feedback adds Table as a seventeenth area, with implementation delivered and release validation still Partial. Repair demonstrated behavior defects, make image examples representative, and add every requested composition with matching copyable source.

Use existing public APIs and daisyUI styling wherever possible. Generated images are visually similar in purpose to the references and stored locally. The plan now records implementation and validation evidence.

No dependency upgrade, new animation framework, slideshow engine, image-loading service, blanket directive-to-component migration, or redesign of the documentation shell. Status is a design question to answer, not an instruction to break its API. The image-first Avatar requirement is satisfied by native image content and the existing optional placeholder input; automatic image-error fallback is outside this request.

## Key files, evidence and decisions

All paths below are repository-relative. `P` means `projects/docs/src/app/pages`; `C` means `projects/docs/src/app/content`. For each changed showcase, update its page, corresponding content/snippets, page stylesheet and `projects/docs/src/app/site-catalog.ts` section anchors together.

| File or source                                                                                                       | Evidence / why it matters                                                                  | Plan impact                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/architecture/0001-platform-support.md`, `0002-component-api-and-composition.md`, `0003-styling-and-theming.md` | Angular 21, native semantics, additive/prefix-aware styling and daisyUI visual ownership   | Preserve supported platforms and current public APIs. Existing component-specific contracts clarify the shipped directive compositions; do not expand this task into resolving historical wording about wrappers. |
| `docs/architecture/0010-modal-native-and-overlay.md`                                                                 | Both Modal backends share guarded close behavior; declarative state is consumer-controlled | Test both backends if the runtime needs a fix; preserve explicit external state ownership.                                                                                                                        |
| `docs/architecture/0018-accordion-aria-composition.md`                                                               | Requires immediate hidden/inert state and Aria-owned expansion                             | Requested close animation changes only visual hiding and lazy teardown timing; immediate inertness remains. See proposed ADR 0028.                                                                                |
| `projects/components/fab/src/fab.ts`, `fab.css`                                                                      | Immediate hidden/display:none; vertical action width affects centered flex layout          | T1: motion plus stable trigger geometry. Movement cause is supported by source, not yet browser-reproduced.                                                                                                       |
| `P/modal.component.ts`, `projects/components/modal/src/modal.ts`                                                     | Showcase guard permits submit or pristine form; no definite runtime defect established     | T2: reproduce dirty-form workflow before selecting fix location.                                                                                                                                                  |
| `projects/components/accordion/src/accordion.ts`                                                                     | Closing hides panel and removes unpreserved lazy content immediately                       | T3: retain the visual content for exit, without another expansion state machine.                                                                                                                                  |
| `projects/components/avatar/src/avatar.ts`, `P/avatar.component.ts`, `C/avatar.content.ts`                           | Library placeholder defaults false; playground defaults true and always renders initials   | T5: correct showcase and snippets; group has extra inner borders on top of daisyUI borders.                                                                                                                       |
| `projects/components/aura/src/aura.ts`, `node_modules/daisyui/components/aura.css`                                   | All size classes are mapped; installed CSS changes halo padding, not child size            | T4: verify actual computed styles and show visible size comparison.                                                                                                                                               |
| `projects/docs/DESIGN_SYSTEM.md`                                                                                     | Page-local styles, SSR, shared reference-page shell; older pages migrate when edited       | Maintain local class compilation and migrate the touched legacy Carousel page within its task.                                                                                                                    |
| `angular.json`, `tools/check-docs-performance.mjs`                                                                   | Docs has no image asset copy mapping; image limits are 100 KiB each / 200 KiB total        | T6: add local asset delivery and optimize before considering measured budget changes.                                                                                                                             |
| `e2e/docs-pages.spec.ts`, `e2e/visual-docs-site.spec.ts`, `playwright.docs.config.ts`, `playwright.config.ts`        | Existing real-page, fixture, visual and production SSR runners                             | Test actual showcase wiring as well as component behavior. Motion needs live-browser checks because visual snapshots suppress animations.                                                                         |
| `.plans/library-follow-ups.md`                                                                                       | Existing follow-ups are recorded as fixed; these reports are new                           | Keep this work in one new plan, without duplicating old issue tracking.                                                                                                                                           |

### Reference coverage

Inspected official docs on 2026-09-29. Live docs report daisyUI **5.7.46**; installed package is **5.7.16**. Live examples define the desired compositions; installed CSS and repository contracts govern implementation compatibility. Do not silently upgrade to match the site.

| Feedback      | Reference and planned coverage                                                                                                                                                                                                                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Avatar        | [Custom sizes](https://daisyui.com/components/avatar/#avatar-in-custom-sizes), [rounded](https://daisyui.com/components/avatar/#avatar-rounded), [mask](https://daisyui.com/components/avatar/#avatar-with-mask), [counter](https://daisyui.com/components/avatar/#avatar-group-with-counter), [ring](https://daisyui.com/components/avatar/#avatar-with-ring), plus default image and text placeholder |
| Badge         | [Badge with icon](https://daisyui.com/components/badge/#badge-with-icon)                                                                                                                                                                                                                                                                                                                                |
| Card          | Images plus [side image](https://daisyui.com/components/card/#card-with-image-on-side), [responsive](https://daisyui.com/components/card/#responsive-card-vertical-on-small-screen-horizontal-on-large-screen), [selectable](https://daisyui.com/components/card/#selectable-cards)                                                                                                                     |
| Carousel      | Images plus [next/previous](https://daisyui.com/components/carousel/#carousel-with-nextprev-buttons) and [indicators](https://daisyui.com/components/carousel/#carousel-with-indicator-buttons)                                                                                                                                                                                                         |
| Chat Bubble   | [Image avatars](https://daisyui.com/components/chat/#chat-with-image) in conversations                                                                                                                                                                                                                                                                                                                  |
| Countdown     | [Clock](https://daisyui.com/components/countdown/#clock-countdown), [labels below](https://daisyui.com/components/countdown/#large-text-with-labels-under), [boxes](https://daisyui.com/components/countdown/#in-boxes)                                                                                                                                                                                 |
| Diff          | [Image comparison](https://daisyui.com/components/diff/)                                                                                                                                                                                                                                                                                                                                                |
| Hover 3D      | Image card and [image gallery](https://daisyui.com/components/hover-3d/#3d-hover-effect-for-image-gallery)                                                                                                                                                                                                                                                                                              |
| Hover Gallery | [Image sequence](https://daisyui.com/components/hover-gallery/)                                                                                                                                                                                                                                                                                                                                         |
| List          | [Second column grows](https://daisyui.com/components/list/#list-second-column-grows---default), [third column grows](https://daisyui.com/components/list/#list-third-column-grows), [third column wraps](https://daisyui.com/components/list/#list-third-column-wraps-to-next-row). The submitted third-column link duplicated the second-column link; use the corrected anchor.                        |
| Stat          | [Stat examples](https://daisyui.com/components/stat/): basic, figures/icons/image, grouped metrics, centered, vertical, responsive and actions; reuse existing examples where they already cover these.                                                                                                                                                                                                 |

## Tasks

T1 and T3–T11 are **Verified** for their scoped checks. T2 is **Blocked** on a missing failure sequence; T12 is **Blocked** on the documented browser runner and older visual-baseline gates. Implementation order: T1–T4 behavior work, T6 assets, then T5 and T7–T11 examples/documentation, then T12 acceptance. Complete each component's focused verification before moving on. No public API change is currently planned.

### T1 — FAB motion and fixed trigger position

- **Status:** Verified. Pre-fix regression measured a 33.83px horizontal jump; actions now use an absolute panel anchored to the trigger. Parent integrated run passed all 7 Chromium FAB checks, including intermediate opacity, ≤1px movement, reversal, corners/RTL, keyboard and reduced motion. All library tests pass. Cross-engine runner limits remain under T12.

- **Change:**
  - Reproduce movement using the real page and long action labels, then anchor actions relative to a stable trigger footprint in fixed and inline modes.
  - Add opening and closing motion, immediate disabling of closed/closing actions, focus restoration and reduced-motion completion. Handle rapid reopen and destruction without stale hidden state.
  - Preserve all corners, RTL positioning, flower layout and the small-screen/long-list fallback.
- **Starts at:** `projects/components/fab/src/fab.ts`, `fab.css`, `P/fab.component.ts`, `projects/docs/src/app/testing/fab-test-fixture.component.ts`.
- **Tests:** Extend `projects/components/fab/src/fab.spec.ts` for state/focus boundaries and `e2e/fab.spec.ts` for trigger coordinates before/during/after open and close (within 1 CSS pixel), visible intermediate motion, eventual hidden state, reversal and reduced motion. Use actual browser layout and existing fixtures; replace incidental static-position assertions with observable geometry if needed.
- **Verify:** `npm run test:lib`; `npx playwright test e2e/fab.spec.ts --project=chromium`. Expect no anchor jump, visible motion with normal preferences, and no focusable invisible actions.

### T2 — Dialog close guard, including the real notes example

- **Status:** Blocked on reproduction. The real notes example passed actual typing, dirty Cancel/Escape/backdrop rejection, Save, focus restoration, reopening with retained text and pristine dismissal before any Modal change. A browser regression was added; no speculative runtime repair. Asked the user for the exact failing sequence; no answer received yet.

- **Change:**
  - Map the report to the Modal page's Close guard example. Reproduce Edit notes → type → Cancel, Escape and backdrop. Each must retain the dialog and text while dirty; Save must close and return the value.
  - Verify pristine dismissal and reopening after save. Fix the smallest failing layer: page form/state wiring, declarative wrapper, or Modal runtime. Keep `guardFiles` consistent with the live example.
  - Preserve async guard serialization, rejection/error retry and teardown behavior; external `open=false` remains the documented owner's state update, not a new veto protocol.
- **Starts at:** `P/modal.component.ts`, `C/modal.content.ts`, `projects/components/modal/src/modal.ts`.
- **Tests:** Add a real-showcase regression in `e2e/docs-pages.spec.ts` using actual typing, not a mocked dirty flag. If the runtime changes, extend `projects/components/modal/src/modal.spec.ts` with controlled promises for the demonstrated boundary and `e2e/modal.spec.ts` for native/overlay dismissal parity.
- **Verify:** `npm run build:docs`; `npx playwright test --config=playwright.docs.config.ts e2e/docs-pages.spec.ts`; if runtime changes, `npm run test:lib` and `npx playwright test e2e/modal.spec.ts --project=chromium`. Expect dirty dismissals blocked, allowed dismissals resolved once, and no lost text/focus.
- **Risk:** The report is not yet reproduced; do not rewrite the close system on the assumption it is broken. If the specified sequence passes before changes, record it and seek the missing failing sequence before claiming this feedback fixed.

### T3 — Accordion close animation

- **Status:** Verified. ADR 0028 accepted. Local presentation lifetime waits only for the existing parent grid transition; Aria still owns expansion and immediate inertness. All 8 focused unit checks and 6 Chromium browser checks pass; parent reran the 388-test library suite and cross-browser suite. Firefox motion checks pass; its axe environment failure and WebKit startup failure are recorded under T12.

- **Change:**
  - Keep Angular Aria as the only expansion owner. Separate immediate semantic closing/inertness from the short visual exit and final hiding.
  - Retain eager and already-created lazy content through exit; then destroy nonpreserved lazy content or retain preserved content according to the existing input.
  - Handle rapid reversal, changing content height, reduced motion and destruction. Prefer component-local CSS and minimal presentation bookkeeping; do not create a shared animation service.
  - Apply the policy in proposed ADR 0028 when implemented; link the supersession of ADR 0018's immediate-visual-hide clause without replacing its remaining decisions.
- **Starts at:** `projects/components/accordion/src/accordion.ts`, `P/accordion.component.ts`, `docs/components/accordion.md`, ADR 0018/0028.
- **Tests:** Extend `projects/components/accordion/src/accordion.spec.ts` for content lifetime/preservation and `e2e/accordion.spec.ts` for an intermediate closing height, final collapse, immediate nonfocusability, preserved values, rapid reversal and reduced motion. Existing Aria-backed fixtures remain real; no mocked animation claims.
- **Verify:** `npm run test:lib`; `npx playwright test e2e/accordion.spec.ts --project=chromium`. Expect smooth collapse with normal motion and correct final layout/content lifetime in both motion modes.

### T4 — Aura size behavior and explanation

- **Status:** Verified. No directive bug reproduced: five rendered paddings are 0, 1, 2, 2.5 and 4px. Added side-by-side examples and halo-thickness explanation. Browser coverage verifies each live playground switch and unchanged child dimensions, plus fixture rendering/reduced motion; reviewed both visual profiles.

- **Change:**
  - Check compiled styles and live switching for xs/sm/md/lg/xl. Installed upstream padding is 0, 0.0625, 0.125, 0.15625 and 0.25rem respectively.
  - Correct class compilation or overriding styles only if actual size values fail to change. Add a labeled side-by-side comparison with identical inner content and explain that size controls halo thickness, while inner content dimensions are separate.
- **Starts at:** `P/aura.component.ts`, `P/styles/aura.daisy.css`, `C/aura.content.ts`, `projects/components/aura/src/aura.ts`.
- **Tests:** Extend `e2e/browser-foundation.spec.ts` Aura coverage for computed halo thickness/extent and `e2e/docs-pages.spec.ts` for live playground switching. Existing unit class tests are insufficient by themselves; only add a unit regression if mapping changes.
- **Verify:** `npx playwright test e2e/browser-foundation.spec.ts --project=chromium -g Aura`; after `npm run build:docs`, run `npx playwright test --config=playwright.docs.config.ts e2e/docs-pages.spec.ts`. Expect distinct rendered halo sizes with unchanged inner-content size.

### T5 — Avatar image-first examples and correct groups

- **Status:** Verified. Default native image, reversible placeholder, custom sizes, rounded/masked/ring variants and groups/counter implemented with existing APIs. Real-page switching/snippet test and image checks pass. Group geometry, single outer borders and RTL overlap visually reviewed.

- **Change:**
  - Default playground and snippet to a native image. Enabling `placeholder` replaces the image with visible text; switching back restores the image.
  - Match upstream group anatomy, border placement and overlap; remove redundant inner borders after checking rendered output. Use images plus a final explicit text counter.
  - Add dedicated custom-size, rounded, mask, group-counter and ring examples. Compose the existing `ZdMask` and compile its required candidates on the Avatar page.
- **Starts at:** `P/avatar.component.ts`, `C/avatar.content.ts`, `P/styles/avatar.daisy.css`, `projects/components/avatar/src/avatar.ts`.
- **Depends on:** T6 assets.
- **Tests:** Real-page image/placeholder switch in `e2e/docs-pages.spec.ts`; focused Avatar visuals in `e2e/visual-docs-site.spec.ts` cover overlap, counter, mask, ring and different dimensions in LTR/RTL. Existing directive API remains unchanged.
- **Verify:** `npm run test:docs`; `npm run build:docs`; `npx playwright test --config=playwright.docs.config.ts e2e/docs-pages.spec.ts`; `npx playwright test e2e/visual-docs-site.spec.ts --project=visual-chromium -g Avatar`. Expect correct default image, working toggle and reviewed group geometry.

### T6 — Generate and serve a reusable image set

- **Status:** Verified. Seven generated WebPs total 203344 bytes (198.58 KiB), with no budget increase. Production and prefixed deployment checks decoded 50 image instances across all 9 image-bearing pages; prefixed requests returned image/webp. Normal build restored afterward. [Asset prompts and provenance](component-showcase-assets.md).

- **Change:**
  - Generate original stock-style photographs/artwork with an available image-generation skill during implementation: small portrait set for Avatar/Chat/Stat; landscape/product artwork for Card/Carousel/Hover 3D/List; a matched before/after pair for Diff; a coherent sequence for Hover Gallery. Reuse assets across pages where appropriate.
  - Save optimized display assets under planned `projects/docs/public/images/showcase/`; add a docs build asset-copy mapping in `angular.json`. Use base-path-compatible relative image URLs, explicit dimensions/aspect ratios, sensible crops, meaningful or decorative alt text and lazy loading below the fold.
  - Keep brief prompt/provenance and usage notes beside the work evidence; ship only optimized images, not embedded base64 or unused originals. Prefer a compact WebP set; no image dependency is required in the published library.
  - Aim within existing 100 KiB individual/200 KiB total image limits. Measure before proposing any increase; if acceptable quality cannot fit after reuse/resizing/compression, document the smallest justified budget change and its checker test/documentation impact before proceeding with that adjustment.
- **Starts at:** `angular.json`, planned image directory, `tools/check-docs-performance.mjs`, `docs/testing/bundle-size-budgets.md`.
- **Tests:** In `e2e/docs-pages.spec.ts`, scroll image examples into view and assert successful image decoding/nonzero natural dimensions. Check production delivery and a non-root base path. Human visual review checks coherent scenes, crops and true Diff correspondence; do not add image-content unit tests.
- **Verify:** `npm run build:docs`; `npm run check:docs:performance`; `npx playwright test --config=playwright.docs.config.ts e2e/docs-pages.spec.ts`. Expect local assets, no missing images and budgets passing without silent relaxation. For the non-root deployment smoke check:
  1. Run `npm run build:docs -- --base-href /zordon-ui/`.
  2. From the repository root, launch this temporary static preview in a managed terminal: `node --input-type=module -e "import express from 'express'; import {resolve} from 'node:path'; const app=express(); const root=resolve('dist/docs/browser'); app.use('/zordon-ui',express.static(root,{index:false})); app.use('/zordon-ui',(req,res)=>res.sendFile(resolve(root,'index.csr.html'))); app.listen(4312,'127.0.0.1');"`.
  3. Open `http://127.0.0.1:4312/zordon-ui/components/avatar` and each image-bearing page. Scroll lazy examples into view; verify image requests use `/zordon-ui/images/showcase/`, return actual image responses, decode successfully and have nonzero natural dimensions. This checks built client delivery at a prefix; normal production SSR is checked separately by the existing suite.
  4. Stop that preview process and run `npm run build:docs` to restore the ordinary output before other built-suite checks.
- **Risk:** Image generation availability and actual compression results are execution checks, not assumed successes. Report a blocker rather than substituting gradients for the requested generated images.

### T7 — Card and Carousel image compositions

- **Status:** Verified. Image compositions, responsive Card, native selections and exact Carousel controls/indicators implemented; Carousel migrated to the shared shell. Production checks pass for geometry, keyboard/radio/disabled selection, alignment, independent tracks and page position in LTR/RTL and reduced motion. Reviewed desktop/mobile and three extra Card themes.

- **Change:**
  - Card: replace image stand-ins in normal and image-full examples; add separate side-image and small-vertical/large-horizontal examples using existing `side`/responsive styling.
  - Card: add checkbox and radio selectable cards with native labels, visible selected/focus states and a disabled option. Keep selection ownership in the example.
  - Carousel: upgrade the existing Previous/Next example to images and add indicator buttons targeting exact slides. Ensure gaps, padding, RTL and reduced motion do not misalign navigation. Keep separate examples isolated and page scroll stable; reuse existing scroll logic where correct.
  - Migrate only the touched Carousel page to `DocsReferencePageComponent` as required by the design system, preserving existing examples and anchors. Update source snippets including CSS needed for responsive classes.
- **Starts at:** `P/card.component.ts`, `C/card.content.ts`, `P/carousel.component.ts`, `C/carousel.content.ts`, corresponding page styles.
- **Depends on:** T6.
- **Tests:** `e2e/docs-pages.spec.ts`: responsive geometry above/below breakpoint; keyboard selection, radio exclusivity and disabled card; exact target-slide alignment, first/last controls, independent carousel instances and indicator navigation. `e2e/visual-docs-site.spec.ts`: focused Card/Carousel layouts.
- **Verify:** `npm run test:docs`; `npm run build:docs`; `npx playwright test --config=playwright.docs.config.ts e2e/docs-pages.spec.ts`; `npx playwright test e2e/visual-docs-site.spec.ts --project=visual-chromium -g 'Card|Carousel'`. Expect usable selection, correct responsive orientation and precise image navigation.

### T8 — Images in Chat, Diff and hover examples

- **Status:** Verified. Generated images used in all four pages; matched Diff framing and hover image fallback visually reviewed. Real-page image decoding, Hover Gallery change/reset, and keyboard Diff reveal proportions (>90% then <10%) pass. Text Diff and decorative member-card examples retained. Touch/no-hover presents useful first images; no library effect API changed.

- **Change:**
  - Chat Bubble: show generated image avatars in conversation examples, retaining author names and correct decorative alt treatment.
  - Diff: use matching before/after images with identical framing/dimensions while retaining the separate text comparison.
  - Hover 3D: replace primary stand-in artwork with an image and add the requested multi-image gallery using existing hosts and eight decorative hit regions per host.
  - Hover Gallery: replace CSS stand-ins with the coherent image sequence; keep its first image useful when hover is unavailable.
- **Starts at:** `P/chat-bubble.component.ts`, `P/diff.component.ts`, `P/hover-3d.component.ts`, `P/hover-gallery.component.ts`, paired content/styles.
- **Depends on:** T6; reuse T5 image-avatar composition where helpful.
- **Tests:** Extend `e2e/docs-pages.spec.ts` for image delivery, Diff interaction and hover-image changes/reset; add focused page visuals to `e2e/visual-docs-site.spec.ts`. Manually inspect hover/touch fallback, image correspondence and reduced motion; existing library effect tests remain the behavior baseline.
- **Verify:** `npm run build:docs`; `npx playwright test --config=playwright.docs.config.ts e2e/docs-pages.spec.ts`; `npx playwright test e2e/visual-docs-site.spec.ts --project=visual-chromium -g 'Chat|Diff|Hover'`. Expect actual images, working effects, preserved text example and useful no-hover content.

### T9 — Countdown compositions

- **Status:** Verified. Clock, labels-under and boxed layouts implemented with deterministic static values. Existing timer retained. Browser labels and Start/Pause/Reset checks pass. Visual review caught reversed RTL clock ordering; explicit ltr direction on the numeric clock/timer and matching snippets fixes it, with geometry regression coverage.

- **Change:**
  - Add hours/minutes/seconds clock, large day/hour/minute/second values with labels beneath, and boxed-unit layouts.
  - Reuse existing directive and example-owned timer behavior. Static initial values are sufficient for layout examples; retain the existing interactive timer without adding independent clocks or a timer service.
  - Keep server/client initial values deterministic and labels readable. If timer logic changes, preserve pause/reset/zero-stop and destruction cleanup.
- **Starts at:** `P/countdown.component.ts`, `C/countdown.content.ts`, `P/styles/countdown.daisy.css`.
- **Tests:** Focused visuals in `e2e/visual-docs-site.spec.ts`; real-page labels/value checks in `e2e/docs-pages.spec.ts`. Only if timing changes, add a planned `P/countdown.component.spec.ts` using controlled time for rollover/zero/cleanup. No duplicate ticking behavior is required for static compositions.
- **Verify:** `npm run test:docs`; `npm run build:docs`; `npx playwright test --config=playwright.docs.config.ts e2e/docs-pages.spec.ts`; `npx playwright test e2e/visual-docs-site.spec.ts --project=visual-chromium -g Countdown`. Expect all three compositions and unchanged timer controls.

### T10 — List and Stat coverage

- **Status:** Verified. All requested compositions, local images and snippets added. Browser geometry checks prove intended growing/wrapped columns and responsive Stat orientation. Integration caught missing lg breakpoint generation in the page-only Tailwind compilation; explicit breakpoint theme metadata fixes it. Horizontal static Stat examples retain native keyboard-accessible scrolling at small widths.

- **Change:**
  - List: expose dedicated second-column growth, third-column growth and third-column wrap sections using existing directives; replace cover stand-ins with generated images.
  - Stat: add or complete the source-reference patterns listed above, including icon/image figures, generated avatar figure, centered metrics, vertical layout and responsive vertical-to-horizontal layout. Preserve and reuse existing basic/grouped/action examples rather than duplicating them.
- **Starts at:** `P/list.component.ts`, `C/list.content.ts`, `P/stat.component.ts`, `C/stat.content.ts`, paired styles.
- **Depends on:** T6; T5 for shared Avatar anatomy.
- **Tests:** `e2e/visual-docs-site.spec.ts` focused List/Stat cases; `e2e/docs-pages.spec.ts` measures intended growing/wrapped column and responsive Stat orientation, preventing class-presence-only false passes. Image decoding is covered by T6.
- **Verify:** `npm run build:docs`; `npx playwright test --config=playwright.docs.config.ts e2e/docs-pages.spec.ts`; `npx playwright test e2e/visual-docs-site.spec.ts --project=visual-chromium -g 'List|Stat'`. Expect correct column geometry and every listed Stat composition.

### T11 — Badge icon and Status rationale

- **Status:** Verified. Icon Badge and Status explanation/examples added; Status remains an attribute directive with consumer-owned semantics. Visible labels, hidden decorative SVG/dots and explicitly named standalone marker reviewed. Production reference-page axe scans pass.

- **Change:**
  - Add Badge with projected inline SVG and visible text. Decorative icon is hidden from assistive technology; no icon dependency or Badge API change.
  - Explain Status as an attribute directive: it styles an existing native element and owns no internal template, state or behavior; consumers retain labels and semantics. Show a decorative dot with adjacent status text and a standalone explicitly labeled dot. Retain `[zdStatus]`.
- **Starts at:** `P/badge.component.ts`, `C/badge.content.ts`, `P/status.component.ts`, `C/status.content.ts`, `docs/components/status.md`.
- **Tests:** Use existing docs accessibility coverage and a focused Badge visual example. No new runtime unit tests for explanatory prose or static icon markup.
- **Verify:** `npm run lint:docs`; `npm run build:docs`; `npm run test:docs:a11y:built`; `npm run check:docs:links`. Expect readable badge label and Status explanation with correct accessible semantics.

### T12 — Integrated acceptance and handoff

- **Status:** Blocked on remaining validation environment/baseline gates. Source integration, scoped checks, independent source review and reviewed visual baselines pass. Full completion remains limited by T2, Firefox/WebKit runner failures and older screenshot-baseline mismatches. Final evidence and review closure below.

- **Change:**
  - Verify every requested section is reachable in the table of contents, live example and copyable code agree, new utility candidates compile, and generated assets are reused and locally served.
  - Record before/after evidence for reported defects and reviewed screenshots for changed examples; do not mark a reported bug fixed merely because new checks pass.
  - Update affected component docs and follow-up evidence; API reports only if an actual public signature changes. Do not promote maturity or close unrelated manual gates.
- **Starts at:** `projects/docs/src/app/site-catalog.ts`, `e2e/docs-pages.spec.ts`, `e2e/visual-docs-site.spec.ts`, this work document.
- **Tests:** Use existing fixture and docs suites. Add tests to existing paths so existing CI commands discover them. New visual test titles must contain their component names exactly as used by the task's `-g` filter; verify nonzero discovery before trusting a scoped run. Scope new visual cases to changed regions; cover desktop/mobile, light/dark, relevant RTL and representative low-/high-radius/custom themes under ADR 0003. Await image decoding and stable layout; do not use screenshots to prove motion. New regressions should fail on the pre-fix behavior where safely reproducible.
- **Verify:**
  - `npm run lint:lib`; `npm run lint:docs`; `npm run lint:browser`; `npm run typecheck:browser`; `npm run test:lib`; `npm run test:lib:types`; `npm run test:docs` — no new errors.
  - `npm run build:lib`; `npm run check:api`; `npm run check:bundle-size` — public/library compatibility retained.
  - `npm run test:docs:ssr` — production build, SSR, real-page browser, accessibility, link, performance and design-system checks pass.
  - `npx playwright test e2e/fab.spec.ts e2e/accordion.spec.ts e2e/modal.spec.ts --project=chromium --project=firefox --project=webkit` — changed motion/dismissal works across supported browser engines.
  - `npx playwright test e2e/visual-docs-site.spec.ts --project=visual-chromium` — review only intentional changed baselines. Generate new expected images deliberately; a bulk baseline update is not acceptance.

### T13 — Table: Angular Aria interaction and CDK data composition

- **Status:** Partial — implementation delivered, independent review Clear. User authorized the table investigation recommendation on 2026-09-29. ADR 0029 records supported separate Aria-interactive and CDK data-rendered modes after the direct-composition spike failed. Release readiness still requires unavailable WebKit, manual assistive-technology and additional Angular support-lane checks.
- **Evidence:** `projects/components/table/src/table.ts` currently supplies only daisyUI classes. Installed `@angular/aria` 21.2.14 exports `Grid`, `GridRow`, `GridCell` and `GridCellWidget`. [Angular Grid documentation](https://angular.dev/guide/aria/grid) demonstrates native tables enhanced with these directives, and recommends native tables for simple read-only data. The installed declarations are the version authority; current live docs may describe newer releases. `docs/foundations/angular-aria-adoption.md` already maps DSP-17 interactive tables to Grid.
- **Change:**
  - Define and implement an opt-in interactive table composition using public Angular Aria Grid primitives for the table, rows, header/data cells and embedded controls. Keep Aria as the keyboard/focus owner; do not write a parallel navigation model.
  - First perform the integration spike required by ADR 0008: verify host-directive composition, Zordon public API isolation (no Aria types in consumer signatures), emitted roles/state, pointer/keyboard behavior, disabled policy, RTL, SSR/hydration, teardown and bundle impact on supported Angular lines. Record the result before treating the public contract as ready.
  - Preserve existing native `[zdTable]` styling and read-only semantics. Document the explicit interactive contract before implementation, including exposed inputs, header roles, focus strategy, disabled behavior and compatibility; add its ADR under the existing decision conventions before introducing public exports.
  - Add real showcase examples for keyboard cell navigation and embedded buttons/checkboxes or editable cells. Demonstrate entering/leaving cell controls, visible focus, correct header relationships and RTL navigation. Retain native caption/row-header examples, sizing, zebra and pinned styling, and update copyable snippets/catalog anchors.
  - Keep sorting, filtering, pagination and virtualization outside this addition. The 2026-09-29 follow-up authorizes a CDK data-source/column-template composition example, separate from Aria interaction. Aria provides interaction primitives, not those data operations. Do not promote readiness/maturity until the interactive contract and checks pass.
- **Starts at:** `projects/components/table/src/table.ts`, its public exports/specs, `projects/docs/src/app/pages/table.component.ts`, `projects/docs/src/app/content/table.content.ts`, `docs/components/table.md`, `docs/foundations/angular-aria-adoption.md`, and the existing Calendar Grid composition as an integration reference.
- **Tests:** Extend Table's real-Aria component specs for composed roles/inputs and lifecycle. Add `e2e/table.spec.ts` plus a dedicated table fixture for one-tab-stop entry/exit, arrow/Home/End navigation, focus retention after row changes, disabled cells, embedded-control activation without accidental grid movement, and RTL. Extend `e2e/docs-pages.spec.ts` for the actual interactive example and `e2e/ssr-hydration.spec.ts` for deterministic markup/hydration. Preserve existing native Table regression checks. Add focused desktop/mobile and light/dark visuals after defining the story matrix; use browser assertions rather than screenshots to prove interaction.
- **Verify:** `npm run test:lib`; `npm run test:lib:types`; `npx playwright test e2e/table.spec.ts --project=chromium --project=firefox --project=webkit`; `npm run test:ssr`; `npm run test:docs:ssr`; `npm run build:lib`; `npm run check:api`; `npm run check:bundle-size`. Expected: actual Aria-owned navigation and control interaction, unchanged native table behavior, matching live/source examples, reviewed API/release intent and no SSR/accessibility regressions. Existing engine failures remain explicit failed/unavailable gates rather than passes.
- **Execution subtasks:** T13a spike/contract: Verified, NG0201 failure for CDK+Aria and native control 3/3 passing; accepted ADR 0029. T13b public Aria directives/unit tests: Verified (11 Table tests, 396 total). T13c showcases/fixture/SSR: Verified in Chromium and Firefox, Partial across all platforms because WebKit cannot launch. T13d API/package/review: Verified for installed Angular 21.2; additional supported lanes and manual review remain open. No spreadsheet scope.
- **Review:** [Independent implementation review](table-implementation-review.md) is Clear, including final fixture and public-page test delta. No material source findings; platform/release validation limits are recorded separately.

## Final acceptance

Follow-up Table acceptance: T13 delivers the approved Aria-backed interactive composition and real showcase behavior, preserving native read-only use. The spike and implementation are verified; release readiness remains Partial until outstanding platform and manual validation is complete.

All feedback rows have an implemented example, verified repair, or an explicit remaining reproduction blocker. FAB stays anchored and animates; dirty Modal dismissal is guarded; Accordion visibly closes while immediately becoming noninteractive; Avatar starts with images and has working text replacement; Aura communicates and renders its size effect. Every requested visual composition has a working example and matching source. All eight explicitly requested image-bearing areas (Card, Carousel, Chat, Diff, Hover 3D, Hover Gallery, List, Stat) use generated local images, also reused by Avatar.

No silent failures, automatic budget relaxation or unreviewed snapshot replacement. Record unavailable browser/generation/manual checks honestly; do not call skipped checks passed. Planning inspection did not run application tests or reproduce browser behavior.

## Execution evidence (2026-09-29)

- Parent validation: library tests **388/388**, docs tests **41/41**; library/docs/browser lint, browser/library type checks, library build and 68 entry-point bundle budgets pass. Production docs build passes with existing CSS-size warnings.
- Production SSR/release suite **10/10**; real-page/navigation suite **55/55**; final targeted Aura/Stat/Countdown/Diff suite **4/4**; accessibility suite **2/2**, including the component reference pages and open panels. Link checker passes 72 sitemap routes/82 documents; image/performance policy passes at 426172 initial bytes, no bundled fonts and seven WebPs. Design-system checker passes 253 files.
- The aggregate docs run first stopped at an existing ambiguous Theme Controller region selector. Exact accessible-name matching fixes that race; browser and accessibility stages were then rerun successfully. An intermediate accessibility attempt was invalidated by the parent rebuilding its output; it was stopped and rerun against stable normal output. These attempts are not counted as passes.
- Browser engine run: **32 passed, 22 failed** across 54 checks. Chromium **18/18** passes. Firefox **14/18** passes; four existing axe scans fail inside `whatwgRNG` with an operation-specific error. All 18 WebKit cases fail at browser launch, exit 3236495362. Bounded escalated reruns reproduced these failures; no retries/skips or scanner suppression were added.
- New visual cases: **14/14** pass without baseline updates after inspection of all 31 new images (desktop light, mobile dark/RTL, three Card themes and image Diff). Fixed off-screen skip-link capture pollution only in new region snapshots. Existing Card playground snapshots intentionally change to generated images. The combined accepted visual run passes 15/15 without updates; other old baselines are preserved.
- Full existing visual suite initially reports 13 old-baseline failures plus the then-stale Countdown baseline. Countdown was corrected and its new baseline reviewed. Two unchanged baseline probes reproduce identical gallery dimensions/pixel differences and Button pixel differences, confirming those failures predate this work. The full unchanged baseline run then reproduced all 13 original failures (2 other cases passed). Card was intentionally updated and reviewed for this task; the remaining 12 old failures are retained as pre-existing baseline work, with no blanket update.
- Regression sensitivity: FAB and Accordion checks failed on the pre-fix behavior. Stat responsive geometry caught the missing compiled breakpoint before correction. Countdown RTL visual review exposed reversed clock order, now covered by position assertions. Modal passes before change, so it is explicitly not claimed repaired. Static example tests are new acceptance coverage rather than evidence of pre-existing defects.
- Independent review examined all T1–T12 implementation against a frozen snapshot: no material source defects. Review gap IR-01 (missing real-page Diff interaction) was accepted and fixed with native keyboard reveal assertions, verified passing. Final review delta includes the RTL clock fix and Windows checker correction.

## Table execution evidence (2026-09-29)

- T13 adds four public Angular Aria host-directive wrappers; the original native Table implementation remains unchanged. Separate real CDK examples demonstrate header/body/footer templates, data rows and displayed-column order. ADR 0029 documents why direct CDK/Aria composition is unsupported by installed 21.2.14.
- Library tests **396/396**, including **11 Table**; docs unit tests **41/41**; tooling **104/104**. Library/docs/browser lint and library/browser type checks pass. Relevant source formatting and whitespace checks pass.
- Table browser fixtures **10/10** across Chromium and Firefox, including axe, nested pointer targets, one-tab-stop navigation, hard disabling, RTL, row reorder focus and complex input activation. WebKit's five attempts fail at launch with exit 3236495362; no passing WebKit claim.
- Table visual checks **2/2** pass without updates after individual inspection of all five new images: desktop light, mobile dark/RTL and corporate/cupcake/custom theme focus. Constrained tables intentionally scroll horizontally and vertically.
- Production SSR build and hydration suite **29/29** pass; Table verifies server roles/IDs and hydrated controls. Docs production build, SSR/release **10/10**, navigation/pages **56/56**, accessibility **2/2** (including Table), link checker (72 routes/82 documents), performance policy (437244 initial bytes) and design-system checker (253 files) pass. These complete all stages of the docs aggregate after the restricted-process attempt was stopped. Existing CSS-size warnings remain.
- Library build, all **68** bundle budgets and package publication dry-run pass. Table is **12.34 KiB raw / 2.51 KiB gzip** under the entry-point metric, which excludes external dependencies. Minor changeset records release intent; nothing published.
- Repository-wide `check:api` exits successfully but mutates baselines through local-mode extraction. The Table report was separately verified by non-local API Extractor; unrelated Dropdown/Megamenu union ordering was restored from the previous task's frozen snapshot. The checker itself was not changed in this task.
- Validation caught missing server roles, mismatched generated IDs, unsupported F2 documentation (installed Aria activates complex controls with Enter), an RTL direction-update race in the test, and fixture focusability lint. Each was corrected and its relevant checks rerun. Restricted-process final browser attempts were stopped and rerun with browser-launch permissions; only successful completed runs count above.
- Independent final source review and narrow-delta review are Clear; [report](table-implementation-review.md). No duplicate renderer/keyboard state or private Aria bridge was added. Manual assistive-technology and additional Angular support lanes remain open, so maturity stays Planned and T13 remains Partial for release acceptance.
- Resources: isolated drafts, validation and review snapshots retained in this task's visualization directory; temporary snippet helper removed. No branches, worktrees, commits or publications. Task-owned completed test servers are cleaned by Playwright; the pre-existing user development server is preserved.

## Handoff

- **Next action:** Obtain the exact Modal failure sequence (T2). For T12, rerun Firefox scans/WebKit on a working browser environment and reconcile the pre-existing visual baseline differences independently of these accepted showcase snapshots.
- **Table follow-up:** T13 implementation is delivered with native styling, opt-in Aria interaction and separate CDK column-template examples. Maturity stays Planned pending WebKit, manual assistive-technology and additional supported Angular-lane checks. See [ADR 0029](../../docs/architecture/0029-table-aria-and-cdk-composition.md) and [implementation review](table-implementation-review.md).
- **Design choices:** Preserve existing composition APIs; Status stays a directive. ADR 0028 accepts only Accordion visual-exit timing, prompted by the user's explicit close-animation request.
- **Reviews:** Planning PR-01 and implementation IR-01 accepted, fixed and independently re-reviewed Clear. [Planning review](component-showcase-feedback-review.md), [final implementation review](component-showcase-implementation-review.md), [complexity prevention/audit](component-showcase-feedback-decomplex.md). No material source findings remain.
- **Deviations:** Aura required explanation/examples rather than a directive repair. Modal required a regression and reproduction request rather than a speculative fix. The Windows-only style-policy failure was caused by path separators defeating documented exemptions; a small normalization fix plus regression restores the existing policy. API extraction adds the protected Accordion presentation field and normalizes two semantically identical union member orders. A patch changeset records FAB/Accordion release intent; no maturity promotion or dependency change.
- **Resources:** One sequential source writer at a time; parallel example drafts and review/baseline snapshots were isolated outside the repository. Existing agent slots were reused because the harness thread cap prevented a fresh spawn; the final reviewer did not author the implementation. No branches/worktrees or commits were created. Completed draft, generated-original, review and validation evidence is retained in the task's visualization directory for traceability. Runtime processes and the baseline dependency junction are cleaned after checks; normal production build restored.
