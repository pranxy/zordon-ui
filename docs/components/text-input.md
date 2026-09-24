# Text Input

**Component ID:** INP-11  
**Entry point:** `@pranxy/zordon-ui/text-input`

`ZdTextInput` styles a native `<input>`. It supports daisyUI colors, sizes, and the ghost variant while preserving the browser's input behavior.

Inputs: `color`; `zdSize` (`xs`–`xl`), prefixed because the native `size` attribute sets the width in characters and stays available; and `variant` (`ghost`). Native `style` and `size` attributes are left to the browser.

```html
<label for="email">Work email</label>
<input id="email" zdTextInput color="primary" zdSize="lg" type="email" />
```

The browser owns input types, values, selection, keyboard editing, autocomplete, constraints, validation, Forms integration, and serialization. Consumers own labels, descriptions, add-ons, prefix and suffix layout, clear and password-reveal actions, character counts, masks, and debounce policy.

Autocomplete modes that change interaction semantics require an explicitly specified Angular Aria Combobox/Listbox composition; this directive remains a native input.
