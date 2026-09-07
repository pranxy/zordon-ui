# Fieldset

**Component ID:** INP-03  
**Maturity:** Planned  
**Planned entry point:** `@pranxy/zordon-ui/fieldset`

Fieldset will be a native-first styling composition: `<fieldset zdFieldset>`, `<legend zdFieldsetLegend>`, and `<label zdFieldsetLabel>`. daisyUI 5.7.16 exposes exactly `fieldset`, `fieldset-legend`, and `fieldset-label`; no color, size, or stable CSS-variable API is present.

The native `<fieldset>` owns grouping and disabled propagation, while `<legend>` supplies the group name. Zordon will not replace those semantics with roles, a CVA, generated IDs, validation messages, or an independent child disabled state. Projected hints, errors, required markers, summaries, and responsive layout remain consumer/Validator ownership until a concrete contract proves otherwise.

No Angular Aria pattern is applicable. The implementation must preserve consumer classes, styles, native `disabled`, labels, controls, and ARIA attributes; use prefix-aware class generation only. Evidence must cover nested/disabled groups, legend naming, consumer errors, SSR/hydration, axe/manual AT, forced colors, zoom/reflow, RTL, and representative visual themes.

## Usage

Use a native fieldset and legend whenever controls share a visible group name. The directives only
add daisyUI candidates; native HTML continues to provide the group relationship and disabled
propagation.

```html
<fieldset zdFieldset disabled aria-describedby="delivery-help delivery-error">
  <legend zdFieldsetLegend>Delivery method</legend>
  <label zdFieldsetLabel for="delivery-email">Email</label>
  <input id="delivery-email" aria-describedby="delivery-help delivery-error" type="email" />
  <p id="delivery-help">We use this only for the delivery confirmation.</p>
  <p id="delivery-error" role="alert">Enter a delivery email.</p>
</fieldset>
```

Nested groups remain native groups. A disabled outer fieldset disables descendant controls, except
controls in its first legend as defined by HTML. Do not mirror that behavior with a separate child
input or a component-level disabled API.

```html
<fieldset zdFieldset>
  <legend zdFieldsetLegend>Contact preferences</legend>
  <fieldset zdFieldset>
    <legend zdFieldsetLegend>Email</legend>
    <label zdFieldsetLabel for="preference">Send product updates</label>
    <input id="preference" type="checkbox" />
  </fieldset>
</fieldset>
```

## Customization

Use ordinary consumer classes, styles, and theme scopes. Fieldset has no Zordon inputs and no
stable `--zd-*` variables because daisyUI 5.7.16 provides only its three structural candidates.
With configured prefixes, register the complete candidates such as `tw:d-fieldset` and
`tw:d-fieldset-legend`; see the [class-prefix guide](../foundations/class-prefixes.md).

Responsive orientation, required markers, summaries, and error layout belong in consumer CSS and
projected markup. Keep ARIA relationships on the actual controls and consumer-owned help/error
elements.

## Avoid

- Do not replace `<fieldset>` or `<legend>` with generic containers and ARIA roles.
- Do not add a ControlValueAccessor, generated IDs, or a second disabled-state owner.
- Do not use `zdFieldsetLabel` as a substitute for an actual label-control association.
- Do not treat daisyUI internal CSS variables as public Zordon customization hooks.

## Sources

- [daisyUI Fieldset documentation](https://daisyui.com/components/fieldset/)
- [HTML `<fieldset>` reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset)
