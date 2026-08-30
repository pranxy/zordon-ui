# Avatar visual matrix

**Component/maturity:** Avatar — Planned  
**Entry point:** `@pranxy/zordon-ui/avatar`  
**Fixture/spec:** `projects/dev/src/app/testing/browser-test-fixture.component.ts` and
`e2e/visual-regression.spec.ts`  
**daisyUI/Angular evidence:** daisyUI 5.7.16 / Angular 21.2

| Area                   | Material visual boundary                        | Chosen representative                                     | Grouping rationale                                                                                |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Presence               | Decorative online/offline indicators            | One online image and one offline placeholder              | Both available upstream presence candidates are visible together.                                 |
| Placeholder            | Consumer-provided initials in the inner wrapper | `avatar-placeholder` with `AC`                            | The directive owns only the outer class; consumers own the fallback content and styling.          |
| Grouping               | Overlapped avatars                              | `avatar-group` containing both examples                   | It verifies the group candidate without inventing list or toolbar semantics.                      |
| Responsive / direction | Narrow RTL layout                               | 390px dark RTL mobile                                     | The focused fixture remains compact and checks logical direction independently of host semantics. |
| Themes / customization | Dark theme and consumer utility classes         | `data-theme="dark"`, consumer sizing/color/radius classes | Upstream themes and consumer-owned appearance remain composition boundaries.                      |

| ID  | Public scenario                                                                | Setup and environment            | Evidence                                                         | Review status         |
| --- | ------------------------------------------------------------------------------ | -------------------------------- | ---------------------------------------------------------------- | --------------------- |
| V01 | Meaningful-image Avatar with online decoration                                 | Public browser and SSR fixtures  | `e2e/browser-foundation.spec.ts` and `e2e/ssr-hydration.spec.ts` | Automated behavior    |
| V02 | Initials placeholder with offline decoration                                   | Public browser and SSR fixtures  | `e2e/browser-foundation.spec.ts` and `e2e/ssr-hydration.spec.ts` | Automated behavior    |
| V03 | Dark RTL mobile group boundary                                                 | 390px, dark, RTL, reduced motion | `avatar--native--dark-rtl-mobile.png`                            | Visual baseline       |
| V04 | Assistive technology, forced colors, zoom/reflow, contrast, and image fallback | Manual review                    | [Avatar accessibility review](avatar-accessibility-review.md)    | Manual review pending |

This focused baseline is not a substitute for image semantics, assistive-technology, contrast,
forced-colors, or image-loading review. Snapshot updates require visual review under the repository
visual-regression policy.
