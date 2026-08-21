# Divider visual matrix

**Component/maturity:** Divider — Planned  
**Entry point:** `@pranxy/zordon-ui/divider`  
**Fixture/spec:** `projects/dev/src/app/testing/browser-test-fixture.component.ts` and
`e2e/visual-regression.spec.ts`  
**Reviewed on:** 2026-08-21  
**daisyUI/Angular evidence:** daisyUI 5.7.16 / Angular 21.2

| Area                    | Material visual boundary                          | Chosen representative                    | Grouping rationale                                                                                                            |
| ----------------------- | ------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Orientation / placement | Side-by-side separation with an end-aligned label | `divider-horizontal divider-end`         | The public fixture combines the non-default direction and placement; unit coverage verifies defaults and stale-token removal. |
| Colors                  | Semantic Divider color                            | `divider-primary` plus neutral `<hr>`    | The fixture distinguishes a labeled primary separator from a native thematic break.                                           |
| Semantics               | Text-bearing, native, and decorative hosts        | `<div>`, `<hr>`, and `aria-hidden` hosts | Screenshot only records the visual result; browser and axe tests protect host semantics.                                      |
| Responsive / direction  | Narrow RTL layout                                 | 390px dark RTL mobile                    | The fixture’s Tailwind responsive layout stacks on mobile and preserves logical end placement.                                |
| Themes / customization  | Dark theme                                        | `data-theme="dark"`                      | Other upstream/consumer themes remain covered by library-wide visual fixtures and manual consumer review.                     |

| ID  | Public scenario                                              | Setup and environment              | Evidence                                                         | Review status         |
| --- | ------------------------------------------------------------ | ---------------------------------- | ---------------------------------------------------------------- | --------------------- |
| V01 | Labeled horizontal Divider                                   | Public browser fixture             | `e2e/browser-foundation.spec.ts`                                 | Automated behavior    |
| V02 | Native `<hr>` and decorative hosts                           | Browser and SSR/hydration fixtures | `e2e/browser-foundation.spec.ts` and `e2e/ssr-hydration.spec.ts` | Automated behavior    |
| V03 | Dark RTL mobile Divider boundary                             | 390px, dark, RTL, reduced motion   | `divider--native--dark-rtl-mobile.png`                           | Visual baseline       |
| V04 | Forced colors, zoom, reflow, and custom-theme color contrast | Manual review                      | [Divider accessibility review](divider-accessibility-review.md)  | Manual review pending |

This focused baseline is not a substitute for semantic, assistive-technology, or forced-colors
review. Snapshot updates require visual review under the repository visual-regression policy.
