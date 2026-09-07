# Radio

**Component ID:** INP-07  
**Entry point:** `@pranxy/zordon-ui/radio`

`ZdRadio` adds daisyUI Radio styling to a consumer-owned native radio input. It does not wrap,
replace, or manage the input or its group.

```html
<fieldset>
  <legend>Plan</legend>
  <label
    ><input type="radio" zdRadio color="primary" size="lg" name="plan" value="starter" checked />
    Starter</label
  >
  <label
    ><input type="radio" zdRadio color="primary" size="lg" name="plan" value="pro" /> Pro</label
  >
</fieldset>
```

## API

- `color`: `neutral`, `primary`, `secondary`, `accent`, `info`, `success`, `warning`, or `error`.
- `size`: `xs`, `sm`, `md`, `lg`, or `xl`.

The directive always adds `radio`; optional inputs add matching daisyUI modifier classes.

## Native state and forms

Use native `name`, `value`, `checked`, `disabled`, `required`, and `form` attributes. Radios with
the same name provide exclusive selection, validation, form serialization, and arrow-key
navigation. Angular's built-in radio accessors remain authoritative, so Reactive Forms,
template-driven forms, and Signal Forms use the inputs directly. `readonly` has no coherent native
radio behavior; use `disabled` when a choice must not be changed.

Labels, layout, descriptions, custom option content, validation messages, and group-level errors
remain consumer-owned. Use a native `fieldset` and `legend` where a group needs a visible accessible
name. No group component or alternate value model is needed because native radios own the interaction.

## Accessibility

Use a visible label for every input and a `fieldset`/`legend` for related options. Preserve native
role, focus, keyboard behavior, and browser submission semantics. Do not add an ARIA radio role or
duplicate checked state.

## Source

- [daisyUI Radio documentation](https://daisyui.com/components/radio/)
