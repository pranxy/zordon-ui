# Indicator

**Component ID:** LYT-05  
**Entry point:** `@pranxy/zordon-ui/indicator`

Indicator positions an item over a native wrapper. `ZdIndicator` and `ZdIndicatorItem` are styling-only directives: choose native elements and semantics that match the content.

```html
<div zdIndicator>
  <span
    zdIndicatorItem
    horizontalPlacement="end"
    verticalPlacement="top"
    class="badge badge-primary"
  >
    New
  </span>
  <button type="button" class="btn">Inbox</button>
</div>
```

`horizontalPlacement` accepts `start`, `center`, and `end`; `verticalPlacement` accepts `top`, `middle`, and `bottom`. Omit either input for daisyUI’s default placement. daisyUI maps logical horizontal placement for RTL automatically.

The item can contain a Badge, Status, or arbitrary consumer content. Consumers own wrapper and item semantics, accessible names, visibility, offsets, responsive policy, interaction, and announcements. The directives add no roles, focus management, ARIA attributes, event listeners, or state.

Consumer classes, styles, and CSS variables remain available on both elements. Use logical daisyUI placement inputs rather than physical left/right positioning when RTL support matters.

## Source

- [daisyUI Indicator documentation](https://daisyui.com/components/indicator/)
