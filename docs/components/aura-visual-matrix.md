# Aura visual matrix

**Component/maturity:** Aura — Planned  
**Entry point:** `@pranxy/zordon-ui/aura`  
**Fixture/spec:** `projects/dev/src/app/testing/browser-test-fixture.component.ts` and
`e2e/visual-regression.spec.ts`  
**daisyUI/Angular evidence:** daisyUI 5.7.16 / Angular 21.2

| Area                   | Material visual boundary                               | Chosen representative               | Grouping rationale                                                                                        |
| ---------------------- | ------------------------------------------------------ | ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Variant                | Rotating rainbow border and glow                       | `aura-rainbow` plus `aura-glow`     | Covers the gradient and pseudo-element animation implementation paths.                                    |
| Size / radius          | Large Button aura and extra-small rounded content aura | `aura-lg` and `aura-xs`             | Exercises direct-child radius heuristics and both scale edges represented by the fixture.                 |
| Motion                 | Static reduced-motion presentation                     | 390px dark RTL with reduced motion  | The baseline intentionally captures the static state; browser behavior proves the live preference switch. |
| Semantics              | Native button and presentational content               | Consumer-owned child elements       | Screenshot records the visual result; browser, axe, and SSR checks protect semantics.                     |
| Themes / customization | Dark theme and consumer color classes                  | `text-primary` and `text-secondary` | Aura color remains `currentColor` consumer composition rather than a Zordon color input.                  |

| ID  | Public scenario                                                                          | Setup and environment            | Evidence                                                         | Review status         |
| --- | ---------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------- | --------------------- |
| V01 | Rainbow Aura around a native Button                                                      | Public browser and SSR fixtures  | `e2e/browser-foundation.spec.ts` and `e2e/ssr-hydration.spec.ts` | Automated behavior    |
| V02 | Glow Aura around consumer content                                                        | Public browser and SSR fixtures  | `e2e/browser-foundation.spec.ts` and `e2e/ssr-hydration.spec.ts` | Automated behavior    |
| V03 | Dark RTL mobile reduced-motion boundary                                                  | 390px, dark, RTL, reduced motion | `aura--native--dark-rtl-mobile.png`                              | Visual baseline       |
| V04 | Forced colors, contrast, zoom/reflow, assistive technology, and automatic-motion context | Manual review                    | [Aura accessibility review](aura-accessibility-review.md)        | Manual review pending |

This focused baseline is not a substitute for manual semantic, contrast, forced-colors, or
auto-motion review. Snapshot updates require visual review under the repository visual-regression
policy.
