# Select

**Component ID:** INP-10  
**Entry point:** `@pranxy/zordon-ui/select`

`ZdSelect` styles a native `<select>`. It supports daisyUI colors, sizes, and ghost styling while leaving option data and selection to the browser.

```html
<label for="environment">Deployment environment</label>
<select id="environment" zdSelect color="primary" size="lg">
  <option value="development">Development</option>
  <option value="production">Production</option>
</select>
```

The browser owns single and multiple selection, `<option>` and `<optgroup>` semantics, disabled options, keyboard interaction, forms, validation, and serialization. Consumers own labels, placeholders, option content, and the option data source.

Searchable, async, tagging, and virtualized choices are a separate advanced component built from Angular Aria Combobox/Listbox and CDK Overlay; they are not part of this native directive.
