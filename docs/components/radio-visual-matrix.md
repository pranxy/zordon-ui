# Radio visual matrix

**Component/maturity:** Radio — Planned
**Entry point:** `@pranxy/zordon-ui/radio`
**Fixture/spec:** `projects/dev/src/app/testing/browser-test-fixture.component.ts` and
`e2e/visual-regression.spec.ts`

| Area                            | Representative evidence                                                                    | Why it is sufficient                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Native anatomy                  | Browser and SSR fixtures include a labelled fieldset and two same-name options.            | Behavior tests protect group selection; the baseline records visual output. |
| Direction and responsive layout | `radio--native--dark-rtl-mobile.png` at 390px, dark theme, RTL, and reduced motion.        | Layout belongs to consumer markup; daisyUI Radio styles only the input.     |
| Colors and sizes                | The fixture renders primary large radios; unit and browser tests assert the exact classes. | All color and size modifiers are generated from the typed inputs.           |
| Manual display modes            | Forced colors, 200% zoom, 400% reflow, and long RTL labels.                                | These require visual review in the consumer’s browser and theme.            |

This focused baseline is not a substitute for native semantics or assistive-technology review.
