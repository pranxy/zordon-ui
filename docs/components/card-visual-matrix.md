# Card visual matrix

**Component/maturity:** Card — Planned  
**Entry point:** `@pranxy/zordon-ui/card`  
**Fixture/spec:** `projects/dev/src/app/testing/browser-test-fixture.component.ts` and
`e2e/visual-regression.spec.ts`  
**daisyUI/Angular evidence:** daisyUI 5.7.16 / Angular 21.2

| Area             | Material visual boundary                | Chosen representative              | Grouping rationale                                                                        |
| ---------------- | --------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| Anatomy          | Direct figure, body, title, and actions | Article Card with image and action | Covers all documented parts without a template wrapper.                                   |
| Styles and sizes | Border/xl and dash/xs                   | Article and selectable-label Cards | Covers the two style candidates and scale edges.                                          |
| Layouts          | Normal, side, and image-full            | Three fixture Cards                | Each upstream layout changes media placement or content treatment.                        |
| Semantics        | Article, heading/button, label/radio    | Consumer-owned native elements     | Browser, axe, and SSR checks protect semantics; the baseline protects appearance only.    |
| Themes/direction | Dark RTL mobile                         | 390px dark RTL with reduced motion | Exposes logical layout, direct media, and long-line boundaries without Card-owned motion. |

| ID  | Public scenario                                                                   | Setup and environment            | Evidence                                                         | Review status         |
| --- | --------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------- | --------------------- |
| V01 | Bordered xl article Card with figure, title, body, and action                     | Public browser and SSR fixtures  | `e2e/browser-foundation.spec.ts` and `e2e/ssr-hydration.spec.ts` | Automated behavior    |
| V02 | Dashed xs side selectable-label Card                                              | Public browser and SSR fixtures  | `e2e/browser-foundation.spec.ts` and `e2e/ssr-hydration.spec.ts` | Automated behavior    |
| V03 | Image-full Card                                                                   | Public browser and SSR fixtures  | `e2e/browser-foundation.spec.ts` and `e2e/ssr-hydration.spec.ts` | Automated behavior    |
| V04 | Dark RTL mobile Card boundaries                                                   | 390px, dark, RTL, reduced motion | `card--native--dark-rtl-mobile.png`                              | Visual baseline       |
| V05 | Contrast, forced colors, zoom/reflow, assistive technology, and real-media review | Manual review                    | [Card accessibility review](card-accessibility-review.md)        | Manual review pending |

This focused baseline is not a substitute for consumer-selected semantics, alternatives, contrast,
forced-colors, or assistive-technology review. Snapshot updates require visual review under the
repository visual-regression policy.
