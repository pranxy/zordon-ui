# Text Input

**Component ID:** INP-11  
**Entry point:** `@pranxy/zordon-ui/text-input`

`ZdTextInput` styles a native `<input>`. It supports daisyUI colors, sizes, and ghost styling while preserving the browser's input behavior.

```html
<label for="email">Work email</label>
<input id="email" zdTextInput color="primary" size="lg" type="email" />
```

The browser owns input types, values, selection, keyboard editing, autocomplete, constraints, validation, Forms integration, and serialization. Consumers own labels, descriptions, add-ons, prefix and suffix layout, clear and password-reveal actions, character counts, masks, and debounce policy.

Autocomplete modes that change interaction semantics require an explicitly specified Angular Aria Combobox/Listbox composition; this directive remains a native input.
