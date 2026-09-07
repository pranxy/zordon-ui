# Range

**Component ID:** INP-08  
**Entry point:** `@pranxy/zordon-ui/range`

`ZdRange` styles a native `<input type="range">`. It supports documented daisyUI colors, sizes, and `vertical` orientation.

```html
<label for="volume">Volume</label>
<input id="volume" type="range" zdRange color="primary" size="lg" min="0" max="100" step="5" />
```

The browser owns value, min/max/step, keyboard interaction, disabled state, validation, forms, and accessibility semantics. Consumers own labels, `<datalist>` tick suggestions, formatted output, tooltips, layout, and dual-thumb controls.

`vertical` adds `range-vertical`. It does not implement a custom slider interaction or a dual-thumb API.
