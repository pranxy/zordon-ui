# Button visual matrix

**Component/maturity:** Button — Planned  
**Entry point:** `@pranxy/zordon-ui/button`  
**Fixture/spec:** `projects/dev/src/app/testing/browser-test-fixture.component.ts` and
`e2e/visual-regression.spec.ts`  
**Reviewed on:** 2026-08-20  
**daisyUI/Angular evidence:** daisyUI 5.7.16 / Angular 21.2

| Area                      | Material visual boundary          | Chosen representative(s)                 | Grouping rationale                                                                                                                   |
| ------------------------- | --------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Variants / colors / sizes | Filled semantic action            | Primary filled Button                    | The demo and class-candidate tests cover the remaining documented modifiers.                                                         |
| States                    | Guarded loading and disabled link | Loading Button plus `aria-disabled` link | Both remain understandable without an animated spinner.                                                                              |
| Responsive layout         | Narrow mobile surface             | 390px viewport                           | The public `wide`/`block` classes are layout modifiers; this story checks native controls remain usable at the constrained boundary. |
| Themes / customization    | Dark theme                        | `data-theme="dark"`                      | Theme-token contrast and consumer-visible host classes are rendered by daisyUI.                                                      |
| Direction / long text     | RTL order and long labels         | RTL with full action names               | Button has no placement API; this checks content retains its natural reading order.                                                  |

| ID  | Public scenario                          | Setup and environment                     | Evidence                                                                             | Review status         |
| --- | ---------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------ | --------------------- |
| V01 | Primary native action                    | Light, desktop, LTR, reduced motion       | Existing component demo and semantic browser test                                    | Automated behavior    |
| V02 | Guarded loading and disabled-link states | Dark, mobile, RTL, reduced motion         | `button--guarded--dark-rtl-mobile.png`                                               | Visual baseline       |
| V03 | Consumer class and state composition     | Unit and browser checks                   | `projects/components/button/src/button.spec.ts` and `e2e/browser-foundation.spec.ts` | Automated behavior    |
| V04 | Focus / forced colors                    | Keyboard and forced-colors browser checks | Existing foundation fixture plus manual review                                       | Manual review pending |

This visual baseline is a focused state boundary, not a substitute for keyboard, screen-reader,
SSR, or forced-colors evidence. Snapshot updates require visual review under the repository visual
regression policy.
