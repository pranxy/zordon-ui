# Link visual matrix

**Component/maturity:** Link — Planned  
**Entry point:** `@pranxy/zordon-ui/link`  
**Fixture/spec:** `projects/dev/src/app/testing/browser-test-fixture.component.ts` and
`e2e/visual-regression.spec.ts`  
**Reviewed on:** 2026-08-20  
**daisyUI/Angular evidence:** daisyUI 5.7.16 / Angular 21.2

| Area                   | Material visual boundary                | Chosen representative(s)                 | Grouping rationale                                                                 |
| ---------------------- | --------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| Variants / colors      | Base underline and hover-only underline | Native inherited-color Link with `hover` | Unit coverage verifies every semantic candidate without snapshotting theme colors. |
| States                 | Unavailable anchor semantics            | `aria-disabled` Link                     | daisyUI has no Link disabled modifier; consumer styling remains additive.          |
| Responsive layout      | Narrow mobile surface                   | 390px viewport                           | Long text remains readable without a Link-owned placement API.                     |
| Themes / customization | Dark theme                              | `data-theme="dark"`                      | Theme-token contrast remains a custom-theme review responsibility.                 |
| Direction / long text  | RTL link order                          | RTL with descriptive labels              | Native inline order is consumer DOM order.                                         |

| ID  | Public scenario                           | Setup and environment               | Evidence                                                         | Review status         |
| --- | ----------------------------------------- | ----------------------------------- | ---------------------------------------------------------------- | --------------------- |
| V01 | Base/hover native anchor                  | Browser behavior and unit contracts | `link.spec.ts` and `e2e/browser-foundation.spec.ts`              | Automated behavior    |
| V02 | Unavailable link with consumer semantics  | Browser and SSR/hydration fixtures  | `e2e/browser-foundation.spec.ts` and `e2e/ssr-hydration.spec.ts` | Automated behavior    |
| V03 | Dark RTL mobile boundary                  | 390px, dark, RTL, reduced motion    | `link--native--dark-rtl-mobile.png`                              | Visual baseline       |
| V04 | Semantic-color contrast and forced colors | Consumer theme plus manual review   | [Link accessibility review](link-accessibility-review.md)        | Manual review pending |

This visual baseline is a focused state boundary, not a substitute for keyboard, screen-reader,
SSR, or forced-colors evidence. Snapshot updates require visual review under the repository visual
regression policy.
