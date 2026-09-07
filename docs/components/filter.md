# Filter

**Component ID:** INP-05  
**Entry point:** `@pranxy/zordon-ui/filter`

`ZdFilter` adds daisyUI Filter styling to a consumer-owned container. `ZdFilterItem` styles native
radio, checkbox, and reset inputs as documented Filter options. `ZdFilterReset` identifies the
native radio used as an All/reset option outside a form.

```html
<form zdFilter>
  <input
    type="radio"
    zdFilterItem
    zdFilterReset
    name="status"
    value="all"
    checked
    aria-label="All"
  />
  <input type="radio" zdFilterItem color="primary" name="status" value="open" aria-label="Open" />
  <input type="reset" zdFilterItem [style]="'ghost'" value="Reset" />
</form>
```

`color` accepts the daisyUI semantic colors; `size` accepts `xs` through `xl`; `style` accepts
`outline`, `dash`, `soft`, `ghost`, and `link`.

Native controls own selected value, reset behavior, keyboard navigation, disabled state, validation,
serialization, and Angular Forms integration. The entry point has no CVA, controlled value, router,
data, icon/count, or responsive-overflow API. Use visible labels or accessible names for input-only
options and a fieldset/legend for related radio groups.

## Source

- [daisyUI Filter documentation](https://daisyui.com/components/filter/)
