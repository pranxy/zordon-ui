# Checkbox

**Component ID:** INP-02  
**Entry point:** `@pranxy/zordon-ui/checkbox`

`ZdCheckbox` adds daisyUI Checkbox styling to a consumer-owned native checkbox. It does not wrap,
replace, or manage the input.

```html
<label for="marketing-updates">
  <input
    id="marketing-updates"
    type="checkbox"
    zdCheckbox
    color="primary"
    size="lg"
    name="marketingUpdates"
  />
  Receive product updates
</label>
```

## API

- `color`: `neutral`, `primary`, `secondary`, `accent`, `info`, `success`, `warning`, or `error`.
- `size`: `xs`, `sm`, `md`, `lg`, or `xl`.

The directive always adds `checkbox`; the optional inputs add the corresponding daisyUI modifier
classes. Consumer classes, attributes, styles, and event bindings remain on the same native input.

## Native state and forms

Use ordinary checkbox HTML for `checked`, `disabled`, `required`, `name`, `value`, and `form`.
Use the platform `HTMLInputElement.indeterminate` property after the input exists for a mixed state;
it is intentionally not a persistent HTML attribute. A native checkbox has no coherent `readonly`
state, so applications should use `disabled` when it must not be changed.

Angular's built-in checkbox accessors remain authoritative. The directive adds no
`ControlValueAccessor`, validator, output, or alternate value model, so it works directly with
typed Reactive Forms, template-driven forms, and Angular Signal Forms:

```html
<input type="checkbox" zdCheckbox [formField]="preferencesForm.productUpdates" />
```

Signal Forms remains an experimental Angular API and is not part of this entry point's public type
surface. Labels, descriptions, validation messages, checkbox groups, select-all behavior, custom
true/false serialization, and form-level validation policy stay consumer-owned; compose this
directive with native `label`, `fieldset`, and Angular form APIs.

## Accessibility

Provide a visible `<label for>` or wrap the input in a label. Preserve the native checkbox role,
keyboard behavior, focus indicator, disabled state, and browser submission semantics. Do not add an
ARIA checkbox role or duplicate checked state: the input already supplies it.

## Source

- [daisyUI Checkbox documentation](https://daisyui.com/components/checkbox/)
