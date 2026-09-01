# Carousel visual matrix

**Component/maturity:** Carousel — Preview  
**Entry point:** `@pranxy/zordon-ui/carousel`  
**Fixture/spec:** `projects/dev/src/app/testing/browser-test-fixture.component.ts` and
`e2e/visual-regression.spec.ts`  
**daisyUI/Angular evidence:** daisyUI 5.7.16 / Angular 21.2

| Area             | Material visual boundary          | Chosen representative               | Grouping rationale                                                                        |
| ---------------- | --------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| Axis             | Horizontal and vertical scrolling | One labelled native list per axis   | Both upstream axis modifiers change overflow and snap direction.                          |
| Alignment        | Center and end snap positions     | Horizontal center and vertical end  | Covers non-default alignment extremes; default start is class-free upstream behavior.     |
| Anatomy          | Container and item                | Ordered list with direct list items | Proves no wrapper element is required for native semantics.                               |
| Themes/direction | Dark RTL mobile                   | 390px dark RTL with reduced motion  | Exposes logical overflow, color tokens, and long item text without Carousel-owned motion. |

| ID  | Public scenario                                                                   | Setup and environment            | Evidence                                                          | Review status         |
| --- | --------------------------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------- | --------------------- |
| V01 | Horizontal center-aligned native list                                             | Public browser and SSR fixtures  | `e2e/browser-foundation.spec.ts` and `e2e/ssr-hydration.spec.ts`  | Automated behavior    |
| V02 | Vertical end-aligned native list                                                  | Public browser and SSR fixtures  | `e2e/browser-foundation.spec.ts` and `e2e/ssr-hydration.spec.ts`  | Automated behavior    |
| V03 | Dark RTL mobile axis/alignment boundaries                                         | 390px, dark, RTL, reduced motion | `carousel--native--dark-rtl-mobile.png`                           | Visual baseline       |
| V04 | Consumer controls, contrast, forced colors, zoom/reflow, and assistive technology | Manual review                    | [Carousel accessibility review](carousel-accessibility-review.md) | Manual review pending |

This focused baseline is not a substitute for consumer-owned controls, announcements, contrast,
forced-colors, or assistive-technology review. Snapshot updates require visual review under the
repository visual-regression policy.
