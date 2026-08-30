# Fieldset

**Component ID:** INP-03  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/fieldset`

Fieldset will be a native-first styling composition: `<fieldset zdFieldset>`, `<legend zdFieldsetLegend>`, and `<label zdFieldsetLabel>`. daisyUI 5.7.16 exposes exactly `fieldset`, `fieldset-legend`, and `fieldset-label`; no color, size, or stable CSS-variable API is present.

The native `<fieldset>` owns grouping and disabled propagation, while `<legend>` supplies the group name. Zordon will not replace those semantics with roles, a CVA, generated IDs, validation messages, or an independent child disabled state. Projected hints, errors, required markers, summaries, and responsive layout remain consumer/Validator ownership until a concrete contract proves otherwise.

No Angular Aria pattern is applicable. The implementation must preserve consumer classes, styles, native `disabled`, labels, controls, and ARIA attributes; use prefix-aware class generation only. Evidence must cover nested/disabled groups, legend naming, consumer errors, SSR/hydration, axe/manual AT, forced colors, zoom/reflow, RTL, and representative visual themes.

## Sources

- [daisyUI Fieldset documentation](https://daisyui.com/components/fieldset/)
- [HTML `<fieldset>` reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset)
