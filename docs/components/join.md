# Join

**Component ID:** LYT-06  
**Entry point:** `@pranxy/zordon-ui/join`

Join visually connects native child controls. `ZdJoin` and `ZdJoinItem` are styling-only directives, so the consumer selects the wrapper’s semantics and each child’s behavior.

```html
<nav zdJoin direction="horizontal" aria-label="Pagination">
  <button zdJoinItem type="button" class="btn">Previous</button>
  <button zdJoinItem type="button" class="btn">Next</button>
</nav>
```

`direction` accepts `horizontal` and `vertical`; omit it for daisyUI’s default horizontal layout. Each direct segmented child receives `zdJoinItem`.

Consumers own navigation, selection, disabled state, keyboard behavior, equal-width or wrapping policies, and accessible names. Join adds no roles, ARIA attributes, focus handling, or state. Native Buttons, Links, Inputs, or arbitrary content remain valid items.

## Source

- [daisyUI Join documentation](https://daisyui.com/components/join/)
