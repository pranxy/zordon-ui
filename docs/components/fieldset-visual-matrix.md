# Fieldset visual matrix

**Component/maturity:** Fieldset — Planned
**Entry point:** `@pranxy/zordon-ui/fieldset`
**Fixture/spec:** `projects/dev/src/app/testing/browser-test-fixture.component.ts` and
`e2e/visual-regression.spec.ts`

| Area                            | Representative evidence                                                                                           | Why it is sufficient                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Native anatomy                  | Browser and SSR fixtures include the fieldset, legend, label, nested group, help, and error content.              | Behavior tests protect native ownership; a screenshot only records the rendered boundary. |
| Direction and responsive layout | `fieldset--native--dark-rtl-mobile.png` at 390px, dark theme, RTL, and reduced motion.                            | Fieldset itself supplies no layout or motion API; consumer markup owns responsive layout. |
| Themes and customization        | Fieldset-specific light and consumer-theme desktop baselines; consumer classes and styles remain native bindings. | daisyUI exposes no Fieldset color, size, or stable custom-property variants.              |
| Manual display modes            | Forced colors, 200% zoom, 400% reflow, and long RTL legends.                                                      | These require visual review in the consumer’s browser and theme.                          |

This focused baseline is not a substitute for native semantics or assistive-technology review.
