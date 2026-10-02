# Badge visual matrix

**Component/maturity:** Badge — Planned  
**Entry point:** `@pranxy/zordon-ui/badge`  
**Fixture/spec:** `projects/dev/src/app/testing/browser-test-fixture.component.ts` and
`e2e/visual-regression.spec.ts`  
**daisyUI/Angular evidence:** daisyUI 5.7.16 / Angular 21.2

| Area             | Material visual boundary                                                                | Chosen representative                          | Grouping rationale                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Colors           | Semantic success/primary/error and neutral ghost                                        | Four fixture Badges                            | Covers theme-dependent foreground/background/border combinations without treating color as semantics. |
| Styles           | Soft, outline, dash, and ghost                                                          | One representative of each style               | All four documented upstream styles have distinct visual treatments.                                  |
| Sizes/content    | Extra-small dot/action, small icon/text, medium ghost text, and extra-large status text | `badge-xs`, `badge-sm`, `badge-md`, `badge-xl` | The fixture covers both scale edges and the material empty/icon/text compositions.                    |
| Semantics        | Static status, disabled native Button, decorative dot                                   | Consumer-owned role/element/attributes         | Browser, axe, and SSR checks protect semantics; the baseline protects appearance only.                |
| Themes/direction | Dark RTL mobile                                                                         | 390px dark RTL with reduced motion             | Compact boundary that exposes logical spacing and consumer styling; Badge adds no motion.             |

| ID  | Public scenario                                                                     | Setup and environment            | Evidence                                                         | Review status         |
| --- | ----------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------- | --------------------- |
| V01 | Soft success status Badge                                                           | Public browser and SSR fixtures  | `e2e/browser-foundation.spec.ts` and `e2e/ssr-hydration.spec.ts` | Automated behavior    |
| V02 | Disabled outlined native Button and dashed icon/text Badge                          | Public browser and SSR fixtures  | `e2e/browser-foundation.spec.ts` and `e2e/ssr-hydration.spec.ts` | Automated behavior    |
| V03 | Dark RTL mobile Badge boundaries                                                    | 390px, dark, RTL, reduced motion | `badge--native--dark-rtl-mobile.png`                             | Visual baseline       |
| V04 | Contrast, forced colors, zoom/reflow, assistive technology, and live-update context | Manual review                    | [Badge accessibility review](badge-accessibility-review.md)      | Manual review pending |

This focused baseline is not a substitute for consumer-selected status semantics, icon/dot
alternatives, contrast, forced-colors, or assistive-technology review. Snapshot updates require
visual review under the repository visual-regression policy.

## Showcase feedback evidence — 2026-09-29

The existing matrix remains the component-wide contract. The focused documentation examples now have reviewed light desktop and dark RTL mobile baselines in `e2e/visual-docs-site.spec.ts` (`showcase-badge--*`). The previews group the requested static compositions; real interactions, motion, geometry and image decoding are covered separately. Card also samples low/high-radius and consumer themes; Diff captures its matched image comparison separately.

See the [implementation evidence](../../adrs/work/component-showcase-feedback.md#execution-evidence-2026-09-29) for the selected boundaries, passing production accessibility/SSR checks, regression sensitivity and remaining browser/baseline limits. This does not close the matrix's outstanding manual gates or change component maturity.
